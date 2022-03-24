import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {ModelProduct, ProductDetail, ProductPaginate} from "../interfaces/product.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private http: HttpClient) { }
  private baseUrl: string = environment.baseUrl

  // Get Product
  getProductById(id: number) : Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.baseUrl}/products/${id}`)
  }

  // Get Products
  getProducts(filter: ProductPaginate): Observable<ModelProduct> {
    let params = new HttpParams();
    filter.page ? params = params.append('page', filter.page) : null;
    filter.page_size ? params = params.append('page_size', filter.page_size) : null;
    filter.id ? params = params.append('id', filter.id) : null;
    return this.http.get<ModelProduct>(`${this.baseUrl}/products/`, {params})
  }

  // Add Product
  addProduct(product: FormData): Observable<ProductDetail> {
    return this.http.post<ProductDetail>(`${this.baseUrl}/products/`, product)
  }

  // Update Product
  updateProduct(idProduct: number, product: FormData) : Observable<ProductDetail> {
    return this.http.post<ProductDetail>(`${this.baseUrl}/products/${idProduct}/`, product)
  }

  // Delete Product
  deleteProduct(id: number) : Observable<number>{
    return this.http.delete<number>(`${this.baseUrl}/products/${id}`)
  }

  // Get Products
  getProductsAll(): Observable<ModelProduct> {
    let params = new HttpParams();
    params = params.append('not_paginate',true);
    return this.http.get<ModelProduct>(`${this.baseUrl}/products/`, {params})
  }

}
