import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FrModalComponent, FrModalHeaderComponent, FrModalService, FrModalSize } from '@fr-widget/sdk/modal';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [
    FrModalComponent,
    FrModalHeaderComponent
  ],
  templateUrl: './error-handler-modal.component.html',
})
export class ErrorModalComponent implements AfterViewInit, OnChanges {

  protected get ModalSize(): typeof FrModalSize {
    return FrModalSize;
  }

  @Input() public errorMessage: string = '';
  @Input() public errorStack: string = '';

  private modalService: FrModalService = inject(FrModalService);
  private errorHandlerService: ErrorHandlerService = inject(ErrorHandlerService);

  protected id: string = 'app-error-modal';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
  }

  ngAfterViewInit(): void {
    this.errorHandlerService
      .errorMessageChange
      .subscribe(() => {
        this.modalService.openModal(this.id);
      })
  }
}
