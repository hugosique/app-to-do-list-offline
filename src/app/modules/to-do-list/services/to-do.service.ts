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
  private changeListener: any;

  constructor() { }

  initDB(onChange: (doc: IListItems, deleted: boolean) => void) {
    this.localDb = new PouchDB('todo-list');

    // Change to variables
    const remoteDb = new PouchDB('http://admin:admin@localhost:5984/todo-list', {
      fetch: (url: string | Request, opts: any) => {
        const token = btoa("admin:admin");
        opts.headers.set('Authorization', 'Basic', + token);
        return PouchDB.fetch(url, opts);
      }
    });

    this.localDb.sync(remoteDb, { live: true, retry: true, });

    if (!this.changeListener) {
      this.changeListener = this.localDb
        .changes({
          since: 'now',
          live: true,
          include_docs: true,
        })
        .on('change', (change: any) => {
          onChange(change.doc, change.deleted)
        })
        .on('paused', (err: any) => console.warn('⏸ Pausado', err))
        .on('active', () => console.log('▶️ Retomando sync'))
        .on('denied', (err: any) => console.error('🚫 Negado', err))
        .on('error', (err: any) => console.error('❌ Erro geral de sync', err));
    }
  }

  getAllItems() {
    return this.localDb.allDocs({ include_docs: true })
      .then((docs: { rows: any[] }) => docs.rows.map((row) => row.doc));
  }

  save(item: IListItems) {
    return this.localDb.post(item);
  }

  update(item: IListItems) {
    return this.localDb.put(item);
  }

  remove(item: IListItems) {
    return this.localDb.remove(item);
  }

  cancelChanges() {
    if (this.changeListener) {
      this.changeListener.cancel();
      this.changeListener = null;
    }
  }
}
