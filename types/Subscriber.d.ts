import { RxCollection, RxDocument } from 'rxdb';
/**
 * Single RXCollection subscriber interface
 *
 * @interface RxSubscriber
 */
interface RxSubscriber {
    readonly criteria: Criteria;
    select(id: string): RxDocument<any>;
    edit(id: string): RxDocument<any>;
    subscribe(criteria?: Criteria): Function;
    kill(): void;
}
declare type SubscriberOptions = {
    lazy?: boolean;
    progressivePaging?: boolean;
    multipleSelect?: boolean;
    autoSelectOnCRUD?: boolean;
};
export declare type Criteria = {
    limit?: number;
    index?: number;
    sort?: {
        [key: string]: number;
    };
    filter?: {
        [key: string]: any;
    };
};
/**
 * Creates a new data sucker for any RxCollection
 * refreshes data on criteria change
 *
 * @class Subscriber
 * @implements {LodgerSubscriber}
 */
export default class Subscriber<N extends string> implements RxSubscriber {
    protected collection: RxCollection<N>;
    readonly options?: SubscriberOptions | undefined;
    private documents;
    criteria: Criteria;
    fetching: Boolean;
    subscribed: Boolean;
    selectedId?: string | string[];
    activeId?: string;
    readonly ids: string[];
    readonly items: any;
    readonly selectedDoc: RxDocument<N, {}>;
    readonly editing: RxDocument<N, {}>;
    readonly length: number;
    kill: () => void;
    /**
     * Creates an instance of Subscriber.
     *
     * @param {string} name - eg. 'registru'
     * @param {Taxonomy} taxonomy
     * @param {Criteriu} criteriu - initial sort / filter criteria if it shall not use the default one
     * @memberof Subscriber
     */
    constructor(collection: RxCollection<N>, options?: SubscriberOptions | undefined);
    /**
     * Observables changes wwhenever data changes
     *
     * @private
     * @param {RxDocument<any>[]} changes
     * @memberof Subscriber
     */
    private handleSubscriptionData;
    private subscribeRequested;
    /**
     * (re)Subscribes with given Criteria
     * happens internaly when criteriu is changed
     *
     * @param {Criteriu} [criteriu]
     * @memberof Subscriber
     */
    subscribe({ limit, index, sort, filter }: Criteria): () => void;
    /**
     * (De)selects an item by it's id
     *
     * @param {string} id
     * @memberof Subscriber
     */
    select(id: string): void;
    /**
     * Sets the active document to be furtherly edited
     *
     * @param {string} id
     * @memberof Subscriber
     */
    edit(id: string): void;
    readonly updates: Promise<{}>;
}
export {};
