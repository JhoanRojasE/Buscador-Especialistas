import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardStats } from '../../models/interfaces';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() stats!: CardStats;
  @Input() clickable = false;
  @Input() single = false;
}