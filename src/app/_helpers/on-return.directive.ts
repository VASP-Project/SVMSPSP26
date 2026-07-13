import { Directive, ElementRef, HostListener, Input } from'@angular/core';
@Directive({
    selector: '[onReturn]'
})
export class OnReturnDirective {
    private el: ElementRef;
    @Input() onReturn: string;
    constructor(private _el: ElementRef) {
        this.el = this._el;
    }
    // @HostListener('keydown', ['$event']) onKeyDown(e) {
    //     alert("sd");
    //     if ((e.which == 13 || e.keyCode == 13)) {
    //         alert(e.keyCode);
    //         e.preventDefault();
    //         if (e.srcElement.nextElementSibling) {
    //             alert("nextElementSibling");
    //             e.srcElement.nextElementSibling.focus();
    //         }
    //         else{
    //             console.log('close keyboard');
    //         }
    //         return;
    //     }

    // }

    @HostListener('keydown', ['$event']) onKeyDown(e:any) {
        if ((e.which == 13 || e.keyCode == 13)) {
            e.preventDefault();

            var focusable = this.el[0].querySelectorAll('input,select,button,textarea');
            var currentIndex = Array.prototype.indexOf.call(focusable, e.target)
            var nextIndex = currentIndex == focusable.length - 1 ? 0 : currentIndex + 1;

            if (nextIndex >= 0 && nextIndex < focusable.length)
                focusable[nextIndex].focus();

            return false;



            // let control:any;
            // control = e.srcElement.nextElementSibling;
            // alert(control);
            // while (true){                
            //     if (control) {
            //       if ((!control.hidden) && 
            //          (control.nodeName == 'INPUT' || 
            //           control.nodeName == 'SELECT' || 
            //           control.nodeName == 'BUTTON' || 
            //           control.nodeName == 'TEXTAREA'))
            //          {
            //                 control.focus();
            //                 return;
            //             }else{
            //                 control = control.nextElementSibling;
            //             }                         
            //     }
            //     else {
            //         console.log('close keyboard');
            //         return;
            //     }            
           // }
        }
    }

}