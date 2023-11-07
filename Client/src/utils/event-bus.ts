import mitt, { Emitter, EventType } from 'mitt';

export type NotificationObjectPayload = {
  title?: string;
  message: string;
  iconName?: string;
};

enum EVENTS {
  error = 'error',
  warning = 'warning',
  success = 'success',
  info = 'info',
  default = 'default',
}

export class EventBus {
  private handledEvents: Array<EventType> = [];

  private emitter: Emitter<Record<EventType, unknown>>;

  constructor () {
    this.emitter = mitt<Record<EventType, unknown>>();
  }

  public get eventList (): Readonly<typeof EVENTS> {
    return EVENTS;
  }

  on (eventName: EventType, handlerFn: (payload: unknown) => void): void {
    if (this.handledEvents.includes(eventName)) return;

    this.emitter.on(eventName, handlerFn);
    this.handledEvents.push(eventName);
  }

  emit (eventName: EventType, payload?: unknown): void {
    this.emitter.emit(eventName, payload);
  }

  off (eventName: EventType, handlerFn: (payload: unknown) => void): void {
    if (!this.handledEvents.includes(eventName)) return;

    this.emitter.off(eventName, handlerFn);
    this.handledEvents = this.handledEvents.filter(event => event !== eventName);
  }

  success (payload: string | NotificationObjectPayload): void {
    this.emit(this.eventList.success, payload);
  }

  error (payload: string | NotificationObjectPayload): void {
    this.emit(this.eventList.error, payload);
  }

  warning (payload: string | NotificationObjectPayload): void {
    this.emit(this.eventList.warning, payload);
  }

  info (payload: string | NotificationObjectPayload): void {
    this.emit(this.eventList.info, payload);
  }
}

export const Bus = new EventBus();
