
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { jsPDF } from 'jspdf';
import { PedidosService, ProductoPedido } from '../servicios/pedidos.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit, OnDestroy {

  productos: ProductoPedido[] = [];
  total = 0;

  nombre = '';
  celular = '';
  direccion = '';
  observaciones = '';

  private suscripcion!: Subscription;

  constructor(private pedidosService: PedidosService) { }

  ngOnInit(): void {
    this.suscripcion = this.pedidosService.carrito$.subscribe(productos => {
      this.productos = productos;
      this.total = this.pedidosService.obtenerTotal();
    });
  }

  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  cambiarCantidad(producto: ProductoPedido, cambio: number): void {
    this.pedidosService.cambiarCantidad(
      producto.id,
      producto.tipo,
      cambio
    );
  }

  eliminarProducto(producto: ProductoPedido): void {
    this.pedidosService.eliminarProducto(
      producto.id,
      producto.tipo
    );
  }

  formatoPrecio(precio: number): string {
    return precio.toLocaleString('es-CO');
  }

  realizarPedido(): void {

    if (this.productos.length === 0) {
      alert('Agrega productos a tu pedido.');
      return;
    }

    if (
      !this.nombre.trim() ||
      !this.celular.trim() ||
      !this.direccion.trim()
    ) {
      alert('Completa los datos del cliente.');
      return;
    }

    this.generarFactura();
  }

  generarFactura(): void {

    const doc = new jsPDF();

    const imagen = new Image();
    imagen.src = '/assets/Logo-manila.png';

    imagen.onload = () => {

      doc.addImage(imagen, 'PNG', 80, 10, 50, 30);

      this.contenidoFactura(doc);

    };

    imagen.onerror = () => {

      this.contenidoFactura(doc);

    };

  }

  contenidoFactura(doc: jsPDF): void {

    const fecha = new Date().toLocaleDateString('es-CO');

    doc.setFontSize(20);
    doc.setTextColor(36, 21, 13);

    doc.text('MANILA RESTAURANTE', 105, 50, {
      align: 'center'
    });

    doc.setFontSize(12);

    doc.text('FACTURA DE PEDIDO', 105, 60, {
      align: 'center'
    });

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text(`Fecha: ${fecha}`, 15, 75);

    doc.setFontSize(13);
    doc.text('Datos del cliente', 15, 90);

    doc.setFontSize(10);

    doc.text(`Nombre: ${this.nombre}`, 15, 100);
    doc.text(`Celular: ${this.celular}`, 15, 108);
    doc.text(`Direccion: ${this.direccion}`, 15, 116);

    let y = 132;

    if (this.observaciones.trim()) {

      const observaciones = doc.splitTextToSize(
        `Observaciones: ${this.observaciones}`,
        180
      );

      doc.text(observaciones, 15, 124);

      y = 124 + observaciones.length * 5 + 8;

    }

    doc.setFontSize(13);
    doc.text('Detalle del pedido', 15, y);

    y += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    doc.text('Producto', 15, y);
    doc.text('Cantidad', 105, y);
    doc.text('Precio', 140, y);
    doc.text('Subtotal', 175, y);

    y += 8;

    doc.setFont('helvetica', 'normal');

    this.productos.forEach(producto => {

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const subtotal = producto.precio * producto.cantidad;

      doc.text(producto.nombre.substring(0, 35), 15, y);
      doc.text(String(producto.cantidad), 110, y);
      doc.text(`$${this.formatoPrecio(producto.precio)}`, 140, y);
      doc.text(`$${this.formatoPrecio(subtotal)}`, 175, y);

      y += 9;

    });

    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(166, 108, 12);

    doc.text(
      `TOTAL: $${this.formatoPrecio(this.total)}`,
      195,
      y,
      { align: 'right' }
    );

    doc.save('Factura-Manila.pdf');

    alert('¡Pedido registrado correctamente!');

    this.pedidosService.vaciarCarrito();

    this.nombre = '';
    this.celular = '';
    this.direccion = '';
    this.observaciones = '';

  }

}
