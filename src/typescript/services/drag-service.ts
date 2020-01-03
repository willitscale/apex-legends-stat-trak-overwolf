import { WindowsService } from "./windows-service";

export class DragService {
  private static readonly SIGNIFICANT_MOUSE_MOVE_THRESHOLD = 1;

  private readonly currentWindow: any;
  private initialMousePosition: any;
  private isMouseDown: boolean;
  private windowsService: WindowsService;

  constructor(windowsService:WindowsService, currentWindow: any, element: HTMLElement) {
    this.windowsService = windowsService;
    this.currentWindow = currentWindow;
    this.initialMousePosition = null;
    this.isMouseDown = false;

    element.addEventListener('mousedown', this.onDragStart.bind(this));
    element.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  public onDragStart(event: MouseEvent) {
    this.isMouseDown = true;
    this.initialMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  public onMouseMove(event: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }

    let isSignificantMove = this._isSignificantMouseMove(event);
    if (!isSignificantMove) {
      return;
    }

    this.isMouseDown = false;

    if (this.currentWindow) {
      this.windowsService.dragMove(this.currentWindow.name);
    }
  }

  private _isSignificantMouseMove(event: MouseEvent) {
    if (!this.initialMousePosition) {
      return false;
    }
    let x = event.clientX;
    let y = event.clientY;
    let diffX = Math.abs(x - this.initialMousePosition.x);
    let diffY = Math.abs(y - this.initialMousePosition.y);
    let isSignificant =
        (diffX > DragService.SIGNIFICANT_MOUSE_MOVE_THRESHOLD) ||
        (diffY > DragService.SIGNIFICANT_MOUSE_MOVE_THRESHOLD);

    return isSignificant;
  }
}
