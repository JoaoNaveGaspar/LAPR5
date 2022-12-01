﻿import { Component, OnInit } from '@angular/core';

import { LogisticsService } from 'src/app/_services/logistics.service';
import {Path} from '../../_models/Path';

@Component({
  selector: 'app-path',
  templateUrl: './get-paths.component.html',
  styleUrls: ['./get-paths.component.css']
})
export class GetAPathComponent implements OnInit {
  paths: Path[] = [];
  content ?: string;
  constructor(private logisticsservice: LogisticsService) { }

  ngOnInit(): void {
    this.getPath();
  }


}