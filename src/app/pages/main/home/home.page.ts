import { Component, inject, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {}

  //======== Cerrar sesión =========== 
  signOut() {
    this.firebaseSvc.signOut();
  }

  // Obtener el usuario actual
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {    
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }


  //======== Obtener productos ===========
  getProducts() {
    const path = `users/${this.user().uid}/products`;
    this.loading=true;

    const sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
       this.products = res;
    this.loading=false;
        sub.unsubscribe();
      }
    });
  }

  //======== Agregar o actualizar producto ===========
  async addUpdateProduct(product?: Product) {

    const result = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    });

    if (result && result.success) this.getProducts(); // Solo recargar productos si se hizo una actualización exitosa
  }

 //confirmacion de eliminacion de producto//
async confirmDeleteProduct(product: Product) {
  this.utilsSvc.presentAlert({
    header: 'eliminar producto',
    message: 'desea eliminar el producto',
    mode: 'ios',
    buttons: [
      {
        text: 'Cancel',
        
      }, {
        text: 'eliminar',
        handler: () => {
          this.deleteProduct(product)
        }
      }
    ]
  });
}

 // ======= Eliminar Producto =======
async deleteProduct(product: Product) {
  let path = `users/${this.user().uid}/products/${product.id}`;

  const loading = await this.utilsSvc.loading();
  await loading.present();

  let imagePath = await this.firebaseSvc.getFilePath(product.image);
  await this.firebaseSvc.deleteFile(imagePath);

  this.firebaseSvc.deleteDocument(path).then(async res => {
    this.products = this.products.filter(p => p.id !== product.id);

    this.utilsSvc.presentToast({
      message: 'Producto eliminado exitosamente',
      duration: 1500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    });
  }).catch(error => {
    console.log(error);
    this.utilsSvc.presentToast({
      message: error.message,
      duration: 2500,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline'
    });
  }).finally(() => {
    loading.dismiss();
  });
}

}
