type Subscriber = (data: any) => any

export class EventEmitter {
	private subscribers: { [event: string]: Subscriber[] } = {}

	public dispatch(event: string, data: any) {
		this.subscribers[event]?.forEach((subscriber) => subscriber(data))
	}

	public subscribe(event: string, subscriber: Subscriber) {
		this.subscribers[event] ??= []
		this.subscribers[event].push(subscriber)
	}

	public unsubscribe(event: string, subscriber: Subscriber) {
		if (this.subscribers[event] == null) return
		this.subscribers[event] = this.subscribers[event].filter((sub) => sub != subscriber)
	}
}
