import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { XlsxReaderService } from './xlsx-reader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'datasheets';
  private xlsxReader = inject(XlsxReaderService);

  handleFileChoice(e: Event) {
    const fileInput = e.target as HTMLInputElement;

    if (!fileInput.files) return;

    const file = fileInput.files[0];

    this.xlsxReader.read(file);
  }
}
