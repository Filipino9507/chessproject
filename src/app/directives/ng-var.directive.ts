import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[ngVar]'
})
export class VarDirective {

    private _context: any = {};

    constructor(private vcRef: ViewContainerRef, private tRef: TemplateRef<any>) {}

    @Input()
    public set ngVar(context: any) {
        this._context.$implicit = this._context.ngVar = context;
        this._update();
    }

    private _update() {
        this.vcRef.clear();
        this.vcRef.createEmbeddedView(this.tRef, this._context);
    }
}