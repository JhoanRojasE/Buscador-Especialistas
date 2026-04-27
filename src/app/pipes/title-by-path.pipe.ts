import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titleByPath', standalone: true })
export class TitleByPathPipe implements PipeTransform {
  transform(items: { path: string; label: string }[], activeRoute: string): string {
    const match = items.find(i => activeRoute.includes(i.path));
    return match ? match.label : '';
  }
}