import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { MapData, Marker } from "./map";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { MapService } from "./map.service";
import { Subject } from "rxjs";
import { IncidentLocations } from "../incidentreport/incidentreport.model";
import { Toast, ToastrService } from "ngx-toastr";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  @ViewChild("canvas", { static: true }) canvasRef: ElementRef;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  maps = new MapData();
  mapSprite: HTMLImageElement;
  markers: Marker[] = [];
  closeResult: string = "";
  incidentLocationList: IncidentLocations[];
  incidentLocations = new IncidentLocations();

  dtTrigger: Subject<any> = new Subject();
  temporaryArray: { x: number; y: number; incidentLocation: string }[] = [];

  constructor(
    private modalService: NgbModal,
    private mapService: MapService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetIncidentLocationList();
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener(
      "mousedown",
      this.mouseClicked.bind(this),
      false
    );
    this.mapSprite = new Image();
    this.mapSprite.src = "../../../assets/images/map.png";
    this.mapSprite.onload = () => {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;
      const maxCanvasWidth = Math.min(this.mapSprite.width);
      const maxCanvasHeight = Math.min(this.mapSprite.height);
      this.canvas.width = maxCanvasWidth;
      this.canvas.height = maxCanvasHeight;
      this.main();
    };
  }

  mouseClicked(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    const marker = new Marker();
    marker.width = 12;
    marker.height = 20;
    marker.xPos =
      (mouseXPos / rect.width) * this.canvas.width - marker.width / 3;
    marker.yPos =
      (mouseYPos / rect.height) * this.canvas.height - marker.height / 3;

    this.markers.push(marker);
  }

  main(): void {
    this.draw();
    requestAnimationFrame(this.main.bind(this));
  }
  public GetIncidentLocationList() {
    this.mapService.GetIncidentLocationList().subscribe(
      (response: IncidentLocations[]) => {
        this.incidentLocationList = response;
        this.draw();
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
      }
    );
  }

  draw(): void {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.mapSprite, 0, 0);
    for (const marker of this.incidentLocationList) {
      this.context.fillStyle = "red";
      this.context.beginPath();
      this.context.arc(marker.xcoordinate, marker.ycoordinate, 7, 0, 2 * Math.PI);
      this.context.fill();
    }
  }
  openModal(template: TemplateRef<any>, event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    const marker = new Marker();
    marker.width = 12;
    marker.height = 20;
    marker.xPos =
      (mouseXPos / rect.width) * this.canvas.width - marker.width / 3;
    marker.yPos =
      (mouseYPos / rect.height) * this.canvas.height - marker.height / 3;
    const x = event.offsetX;
    const y = event.offsetY;
    this.maps.x = Math.floor(marker.xPos);
    this.maps.y = Math.floor(marker.yPos);
    const modalRef = this.modalService.open(template, {
      ariaLabelledBy: "modal-basic-title",
      size: "md",
    });
    modalRef.componentInstance.x = x;
    modalRef.componentInstance.y = y;
    modalRef.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  savePlace() {
    const marker = new Marker();
    const { x, y, incidentLocation, locationName } = this.maps;
  
    if (!incidentLocation) {
      alert("Select Location");
      return;
    }
    this.mapService
      .UpdateIncidentLocationMaster(incidentLocation, x, y)
      .subscribe((response: IncidentLocations) => {
        this.incidentLocations = response;
        this.GetIncidentLocationList();

        this.toastr.success("Coordinates Saved Successfully");
        this.modalService.dismissAll();
      });
  }
  close() {
    const { incidentLocation } = this.maps;
    if (incidentLocation == 0 || incidentLocation == undefined || incidentLocation == null) {
      this.markers.pop();
      this.modalService.dismissAll();
    } else {
      this.modalService.dismissAll();
    }
  }
}
