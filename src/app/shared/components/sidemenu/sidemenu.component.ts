import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];

  ngOnInit() {
    this.getProducts();
  }

  //======== Cerrar sesión =========== 
  signOut() {
    this.firebaseSvc.signOut();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  // Método para obtener productos desde FirebaseService
  getProducts() {
    this.firebaseSvc.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
}
