import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-results',
  templateUrl: './empty-results.component.html',
  styleUrls: ['./empty-results.component.scss'],
})
export class EmptyResultsComponent implements OnInit {

  @Input() iconName: string;
  @Input() message: string;
  @Input() additionalMessage: string;

  constructor() { }

  ngOnInit() {}

}
