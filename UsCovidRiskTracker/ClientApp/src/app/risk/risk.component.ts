import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import us from '../data/states-albers-10m.json';
import { GeoJsonProperties } from "geojson";
import { GeometryCollection, Topology, GeometryObject } from "topojson-specification";
import { CovidStatsService } from '../covid-stats.service';
import { StateStats } from '../state-stats';
import { firstValueFrom } from 'rxjs';


interface Metric {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.css']
})
export class RiskComponent implements OnInit {

  private svg: any;
  private margin = 50;
  private width = 975 - (this.margin * 2);
  private height = 610 - (this.margin * 2);

  selected = 'overallRiskLevel'

  metrics: Metric[] = [
    { value: 'overallRiskLevel', viewValue: 'Overall Risk Level' },
    { value: 'caseDensityLevel', viewValue: 'Cases per 100k Level' },
    { value: 'testPositivityRatioLevel', viewValue: 'Test Positivity Ratio Level' },
    { value: 'infectionRateLevel', viewValue: 'Infection Rate Level' }
  ];

  //TODO add routes to go back and forth
  onMetricChanged(value: string): void {
    this.recreateSvg();
  }

  stateStats: StateStats[] = [];

  constructor(private covidStatsService: CovidStatsService) { }

  async ngOnInit() {
    this.stateStats = await firstValueFrom(this.covidStatsService.getStatesStats());
    //TODO add wait indicator
    this.recreateSvg();
  }

  private async recreateSvg(): Promise<void> {

    d3.select("figure#risk svg").remove();

    this.svg = d3.select("figure#risk")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))

    let path = d3.geoPath();

    const states = new Map<string, number>();
    this.stateStats.forEach(s => states.set(s.stateName, s[this.selected as keyof StateStats] as number));
    states.set("default", 0);

    const color = d3.scaleOrdinal([0, 1, 2, 3, 4, 5], ["#CCCCCC", "#01D475", "#FEC900", "#FF9600", "#D9002B", "#7A0019"]);

    this.svg.append("g")
      .selectAll("path")
      .data(topojson.feature((us as unknown) as Topology, us.objects.states as GeometryCollection).features)
      .join("path")
      .attr("fill", (d: GeometryObject<GeoJsonProperties>) => {
        return color(states.get((d.properties as any).name) ?? 0)
      })
      .attr("stroke", "white")
      .attr("d", path);
  }

}
