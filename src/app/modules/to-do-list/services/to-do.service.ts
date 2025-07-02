import { Injectable } from '@angular/core';

// Interface
import { IListItems } from '../interface/IListItems.interface';

// Deps
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  localDb: any;
  listItems!: any[];

  constructor() { }

  initDB() {
    this.localDb = new PouchDB('todo-list');

    // Change to variables
    const remoteDb = new PouchDB('http://localhost:5984/todo-list', {
      fetch: (url: string | Request, opts: any) => {
        const login = 'admin';
        const password = 'admin';
        const token = btoa(login + ":" + password);
        opts.headers.set('Authorization', 'Basic', + token);
        return PouchDB.fetch(url, opts);
      }
    });

    this.localDb.sync(remoteDb, {
      live: true,
      retry: false,
    });
  }

  private findIndex(id: string) {
    const todoIndex = this.listItems.find(item => item.id === id);
    return todoIndex;
  }

  private onDatabaseChange = (change: any) => {
    const index = this.findIndex(change.id);
    const item = this.listItems[index];

    if (change.deleted) {
      if (item) {
        this.listItems.splice(index, 1);
      }
    } else {
      if (this.listItems && item.id === change.id) {
        this.listItems[index] = change.doc;
      } else {
        this.listItems.splice(index, 0, change.doc);
      }
    }
  }

  getAllItems() {
    if (!this.listItems) {
      return this.localDb.allDocs({ include_docs: true })
        .then((docs: { rows: [] }) => {
          this.listItems = docs.rows.map((row: { doc?: any }) => row.doc);
          this.localDb.changes({ live: true, since: 'now', include_docs: true }).on('change', this.onDatabaseChange);
          return this.listItems;
        })
    } else {
      return Promise.resolve(this.listItems);
    }
  }

  save(item: any) {
    return this.localDb.post(item);
  }

  update(item: any) {
    return this.localDb.put(item);
  }

  remove(item: any) {
    return this.localDb.remove(item);
  }
}
