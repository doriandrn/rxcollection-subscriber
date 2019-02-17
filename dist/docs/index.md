## Classes

<dl>
<dt><a href="#Subscriber">Subscriber</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#insertNitems">insertNitems(n)</a></dt>
<dd><p>Inserts n items to collection</p>
</dd>
</dl>

## Interfaces

<dl>
<dt><a href="#RxSubscriber">RxSubscriber</a></dt>
<dd><p>Single RXCollection subscriber interface</p>
</dd>
</dl>

<a name="RxSubscriber"></a>

## RxSubscriber
Single RXCollection subscriber interface

**Kind**: global interface  
<a name="Subscriber"></a>

## Subscriber
**Kind**: global class  
**Implements**: <code>LodgerSubscriber</code>  

* [Subscriber](#Subscriber)
    * [new Subscriber()](#new_Subscriber_new)
    * [._temp](#Subscriber._temp)
        * [new _temp(name, collection, options)](#new_Subscriber._temp_new)
    * [._temp#subscribe([criteriu])](#Subscriber._temp+subscribe)
    * [._temp#select(id)](#Subscriber._temp+select)
    * [._temp#edit(id)](#Subscriber._temp+edit)

<a name="new_Subscriber_new"></a>

### new Subscriber()
Creates a new data sucker for any RxCollection
refreshes data on criteria change

<a name="Subscriber._temp"></a>

### Subscriber.\_temp
**Kind**: static class of [<code>Subscriber</code>](#Subscriber)  
<a name="new_Subscriber._temp_new"></a>

#### new \_temp(name, collection, options)
Creates an instance of Subscriber.


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| collection | <code>RxCollection</code> | 
| options | <code>SubscriberOptions</code> | 

<a name="Subscriber._temp+subscribe"></a>

### Subscriber.\_temp#subscribe([criteriu])
(re)Subscribes with given Criteria
happens internaly when criteriu is changed

**Kind**: static method of [<code>Subscriber</code>](#Subscriber)  

| Param | Type |
| --- | --- |
| [criteriu] | <code>Criteriu</code> | 

<a name="Subscriber._temp+select"></a>

### Subscriber.\_temp#select(id)
(De)selects an item by it's id

**Kind**: static method of [<code>Subscriber</code>](#Subscriber)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="Subscriber._temp+edit"></a>

### Subscriber.\_temp#edit(id)
Sets the active document to be furtherly edited

**Kind**: static method of [<code>Subscriber</code>](#Subscriber)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="insertNitems"></a>

## insertNitems(n)
Inserts n items to collection

**Kind**: global function  

| Param |
| --- |
| n | 

