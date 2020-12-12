import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'app-promotion-dialog',
    template: `
        <nb-card id="promotion-dialog">
            <nb-card-header>Promote pawn to:</nb-card-header>
            <button nbButton (click)="close()">Cancel</button>
            <nb-card-footer></nb-card-footer>
        </nb-card>
    `,
    styles: [
        `#promotion-dialog {
            padding-left: 20px;
            padding-right: 20px;
        }`
    ]
})
export class PromotionDialogComponent { 

    public constructor(private dialogRef: NbDialogRef<any>) {
    }

    public close() {
        this.dialogRef.close();
    }
}
