import {AfterViewInit, ChangeDetectorRef, ComponentRef, Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { TooltipComponent } from './tooltip.component';

@Directive({ selector: '[appTooltip]' })
export class TooltipDirective implements OnInit, AfterViewInit {

  @Input('appTooltip') text = 'start';

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private overlayPositionBuilder: OverlayPositionBuilder,
              private elementRef: ElementRef,
              private cd: ChangeDetectorRef) {
    elementRef.nativeElement.style.backgroundColor = 'yellow';
  }

  public ngAfterViewInit () {
  }

  ngOnInit(): void {
    console.log('tooltip directive init', this.text);
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8,
      }]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('mouseenter')
  show() {
    console.log('tooltip directive show', this.text );
    const portal = new ComponentPortal(TooltipComponent);

    const tooltipRef: ComponentRef<TooltipComponent> = this.overlayRef.attach(portal);

    tooltipRef.instance.type = this.text;
    this.cd.markForCheck();
    console.log('tooltipRef', tooltipRef.instance, portal.component);
    tooltipRef.instance.show('sss');

    this.overlayRef.updatePosition();


  }

  @HostListener('mouseout')
  hide() {
    setTimeout(() => {
      console.log('tooltip directive hide', this.text);
      this.overlayRef.detach();
    }, 1000);
  }
}
