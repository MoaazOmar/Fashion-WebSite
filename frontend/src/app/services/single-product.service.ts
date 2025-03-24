import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { CommentEvent, CommentPayload } from '../../interfaces/product.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class SingleProductService {
    private apiurl = `http://localhost:3000/product`;
    constructor(
        private _http: HttpClient,
        private socket: Socket,
        private _authService: AuthService
    ) { }

    getProduct(id: string): Observable<any> {
        return this._http.get(`${this.apiurl}/${id}`);
    }

    
    getRelatedProducts(productId: string): Observable<any> {
    return this._http.get(`${this.apiurl}/${productId}/related`);
    }

    toggleLikeProduct(productId: string): Observable<any> {
        return this._http.post(`http://localhost:3000/product/${productId}/like`, {},  { withCredentials: true });
    }
      
    toggleDislikeProduct(productId: string): Observable<any> {
        return this._http.post(
          `http://localhost:3000/product/${productId}/dislike`,
          {},
          { withCredentials: true }
        );
      }
            
    joinRoom(roomId: string): void {
        this.socket.emit('joinRoom', roomId);
    }

    sendComment(productId: string, text: string, parentId: string | null = null, rating?: number): void {
        const comment = { text, parentId, rating };
        const payload = { productId, comment };
        console.log('Sending comment payload:', payload);
        this.socket.emit('newComment', payload);
      }
      
    getComments(): Observable<CommentEvent> {
        return new Observable(observer => {
            this.socket.on('receiveComment', (data) => {
                observer.next(data);
            });
        });
    }

    deleteComment(productId: string, commentId: string): void {
        this.socket.emit('deleteComment', { productId, commentId });
    }

    editComment(productId: string, commentId: string, newText: string): void {
        this.socket.emit('editComment', { productId, commentId, newText });
    }

    getCommentEdits(): Observable<any> {
        return this.socket.fromEvent('commentEdited');
    }

    getCommentDeletes(): Observable<any> {
        return this.socket.fromEvent('commentDeleted');
    }

    toggleLikeComment(productId: string, commentId: string): void {
        const currentUser = this._authService.currentUserValue;
        if (!currentUser) {
            console.error('No user is logged in');
            return;
        }
        this.socket.emit('toggleLikeComment', { productId, commentId, userId: currentUser.id });
    }

    toggleDislikeComment(productId: string, commentId: string): void {
        const currentUser = this._authService.currentUserValue;
        if (!currentUser) {
            console.error('No user is logged in');
            return;
        }
        this.socket.emit('toggleDislikeComment', { productId, commentId, userId: currentUser.id });
    }

    toggleLoveComment(productId: string, commentId: string): void {
        const currentUser = this._authService.currentUserValue;
        if (!currentUser) {
            console.error('No user is logged in');
            return;
        }
        this.socket.emit('toggleLoveComment', { productId, commentId, userId: currentUser.id });
    }

    getCommentReactionUpdates(): Observable<any> {
        return this.socket.fromEvent('commentReactionUpdated');
    }

    getUserReactionUpdates(): Observable<any> {
        return new Observable((observer) => {
            this.socket.on('userReactionUpdated', (data) => {
                observer.next(data);
            });
        });
    }
    // In SingleProductService
    getCommentErrors(): Observable<string> {
  return new Observable(observer => {
      this.socket.on('commentError', (message) => {
          observer.next(message);
      });
  });
}
}