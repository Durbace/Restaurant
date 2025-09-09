import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  private hoverTimers = new WeakMap<HTMLElement, number>();

  openHover(evt: Event) {
    const el = evt.currentTarget as HTMLElement;
    const t = this.hoverTimers.get(el);
    if (t) {
      clearTimeout(t);
      this.hoverTimers.delete(el);
    }
    el.classList.add('open');
  }

  closeHover(evt: Event) {
    const el = evt.currentTarget as HTMLElement;
    const prev = this.hoverTimers.get(el);
    if (prev) clearTimeout(prev);
    const t = window.setTimeout(() => {
      el.classList.remove('open');
      this.hoverTimers.delete(el);
    }, 120);
    this.hoverTimers.set(el, t);
  }
}
