import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
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

  private locked = false;
  private startY: number | null = null;

  private get hero(): HTMLElement | null {
    return document.querySelector('.hero');
  }
  private get nextSection(): HTMLElement | null {
    const hero = this.hero;
    if (!hero) return null;
    return hero.nextElementSibling instanceof HTMLElement ? hero.nextElementSibling : null;
  }

  private inHero(): boolean {
    const hero = this.hero;
    return !!hero && window.scrollY < hero.offsetTop + hero.offsetHeight - 1;
  }

  private smoothTo(el: HTMLElement) {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(e: WheelEvent) {
    if (this.locked || !this.inHero()) return;
    if (e.deltaY > 0 && this.nextSection) {
      e.preventDefault();
      this.locked = true;
      this.smoothTo(this.nextSection);
      setTimeout(() => (this.locked = false), 700);
    }
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    this.startY = e.touches[0].clientY;
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (this.startY === null || this.locked || !this.inHero() || !this.nextSection) return;
    const delta = e.touches[0].clientY - this.startY;
    if (delta < -8) {
      e.preventDefault();
      this.locked = true;
      this.smoothTo(this.nextSection);
      setTimeout(() => {
        this.locked = false;
        this.startY = null;
      }, 700);
    }
  }

  @HostListener('window:touchend')
  onTouchEnd() {
    this.startY = null;
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.locked || !this.inHero() || !this.nextSection) return;
    if ([' ', 'PageDown', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      this.locked = true;
      this.smoothTo(this.nextSection);
      setTimeout(() => (this.locked = false), 700);
    }
  }
}
