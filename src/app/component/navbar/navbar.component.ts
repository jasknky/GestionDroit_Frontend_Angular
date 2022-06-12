import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent  {

  public items: any[];

  constructor(private router: Router) {
    this.items = this.mapItems(router.config);
  }

  public onSelect({ item }): void {
    if (!item.items) {
      this.router.navigate([item.path]);
    }
  }

  // convert the routes to menu items.
  private mapItems(routes: any[], path?: string): any[] {
    return routes.map((item) => {
      const result: any = {
        text: item.text,
        path: (path ? `${path}/` : "") + item.path,
      };

      if (item.children) {
        result.items = this.mapItems(item.children, item.path);
      }

      return result;
    });
  }

}
