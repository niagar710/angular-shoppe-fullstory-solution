import { Injectable } from "@angular/core";
import { Product } from "../models";
import { ReplaySubject } from "rxjs";
import { ProductService } from "./product.service";
import { DatalayerService } from "./datalayer.service";

import * as FullStory from "@fullstory/browser";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private items: Product[] = [];
  private subject = new ReplaySubject<Product[]>();

  constructor(
    private datalayer: DatalayerService,
    private productService: ProductService,
  ) {}

  /**
   * Adds an item to the shopping cart. If not already added, product details
   * will be obtained from the catalog. If the item already exists, the item's
   * quantity will be incremented by one.
   * @param productId the Product ID of the corresponding item
   */
  addItem(productId: number): void {
    // check if the item is already in the cart
    const item = this.items.find((product) => product.id === productId);

    if (item) {
      // update the item's quantity and notify observers
      const { quantity } = item;
      item.quantity += quantity;

      this.subject.next(this.items);

      // update the data layer
      this.datalayer.addToCart(item, this.items);
    } else {
      // get the product from the catalog and add as an initial item
      this.productService.getProduct(productId).subscribe((product) => {
        const item: Product = {
          ...product,
          quantity: 1, // initial quantity of 1
        };

        // store the item and notify observers
        this.items.push(item);
        this.subject.next(this.items);

        // update the data layer
        this.datalayer.addToCart(item, this.items);
      });
    }
  }

  /**
   * Increases the quantity of an existing cart item by one.
   */
  increaseQuantity(productId: number, source: string = "unknown"): void {
    const item = this.items.find((product) => product.id === productId);

    if (item) {
      item.quantity += 1;
      this.subject.next(this.items);
      this.datalayer.addToCart(item, this.items);

      FullStory.event("Cart Quantity Increased", {
        product_id_str: String(item.id),
        product_name_str: item.title,
        quantity_int: item.quantity,
        source_str: source,
      });
    }
  }

  /**
   * Decreases the quantity of an item by one.
   * Removes the item if its quantity reaches zero.
   */
  decreaseQuantity(productId: number, source: string = "unknown"): void {
    const item = this.items.find((product) => product.id === productId);

    if (item) {
      if (item.quantity <= 1) {
        this.removeItem(productId, source);
        return;
      }

      item.quantity -= 1;
      this.subject.next(this.items);

      FullStory.event("Cart Quantity Decreased", {
        product_id_str: String(item.id),
        product_name_str: item.title,
        quantity_int: item.quantity,
        source_str: source,
      });
    }
  }

  /**
   * Calculates the total cost of all items in the cart (price x quantity).
   */
  calculateTotalCost(): number {
    return this.items.reduce(
      (acc: number, item: Product) => (acc += item.price * item.quantity),
      0,
    );
  }

  /**
   * Empties all items in the cart.
   */
  clear() {
    this.items = [];
    this.subject.next(this.items);
  }

  /**
   * Gets the items in the cart as an Observable.
   * A ReplaySubject is used to re-emit the cart's items to newly instantiated
   * components.
   */
  getItems(): ReplaySubject<Product[]> {
    return this.subject;
  }

  /**
   * Removes an item entirely from the cart.
   * @param productId the Product ID of the corresponding item
   */
  removeItem(productId: number, source: string = "unknown"): void {
    const index = this.items.findIndex((product) => product.id === productId);

    if (index >= 0) {
      const item = this.items[index];

      this.items.splice(index, 1);
      this.subject.next(this.items);

      this.datalayer.removeFromCart(item, this.items);

      FullStory.event("Cart Item Removed", {
        product_id_str: String(item.id),
        product_name_str: item.title,
        quantity_int: item.quantity,
        source_str: source,
      });
    }
  }
}
