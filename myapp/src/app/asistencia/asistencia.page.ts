import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Browser } from '@capacitor/browser';
import { Plugins,  } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import { PermissionState } from '@capacitor/core';
import { Platform } from '@ionic/angular';


const { Permissions } = Plugins;
@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  constructor(private router: Router,private platform: Platform) { }

  ngOnInit() {
  }
  redirectToAsistencia() {
    this.router.navigate(['/asistencia']); // Navega a la página de asistencia
  }
  irAHome() {
    this.router.navigate(['/home']); 
  }
  redirigirAGenerarQR() {
    this.router.navigate(['/generarqr']);
  }
  redirectToInicio() {
    this.router.navigate(['/inicio']); // Navega a la página de asistencia
    this.platform.ready().then(() => {
      this.solicitarPermisosDeCamara();
    });
    
}

async escanearQR() {
  try {
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      await this.leerTexto(result.content);

      // Verificar si el contenido del QR es una URL antes de navegar
      const isUrl = /^(https?|ftp):\/\//.test(result.content);
      if (isUrl) {
        // Usar el plugin Capacitor Browser para abrir la URL
        await Browser.open({ url: result.content });
      } else {
        // Si no es una URL, imprimir el contenido en la consola
        console.log('Contenido del QR:', result.content);
      }
    }
  } catch (error) {
    console.error('Error al escanear:', error);
  }
}

async leerTexto(texto: string) {
  try {
    if (TextToSpeech) {
      await TextToSpeech.speak({
        text: texto,
        lang: 'es-US',
        rate: 1.0,
      });
    } else {
      console.warn('La funcionalidad de TextToSpeech no está disponible en este dispositivo.');
    }
  } catch (error) {
    console.error('Error al leer texto:', error);
  }
}

async solicitarPermisosDeCamara() {
  try {
    const result = await Permissions['requestPermission']({ name: 'camera' });

    if (result.state === 'granted') {
      await this.escanearQR();
    } else {
      console.warn('Permiso de la cámara denegado');
    }
  } catch (error) {
    console.error('Error al solicitar permisos de la cámara:', error);
  }
}

}
