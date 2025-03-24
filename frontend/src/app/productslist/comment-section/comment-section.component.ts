import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommentEvent, CommentSubmission, Product, Comment } from '../../../interfaces/product.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SingleProductService } from '../../services/single-product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-comment-section',
    templateUrl: './comment-section.component.html',
    styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit, OnDestroy {
    product!: Product;
    productId!: string;
    commentTree: Comment[] = [];
    newComment = { text: '' };
    commentSub!: Subscription;
    editSub!: Subscription;
    deleteSub!: Subscription;
    reactionSub!: Subscription;
    userReactionSub!: Subscription;
    isLoggedIn: boolean = false;
    selectedRating: number = 0;

    constructor(
        private _authService: AuthService,
        private _singleProductService: SingleProductService,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.isLoggedIn = !!this._authService.currentUserValue;
        this.route.params.subscribe(params => {
            console.log('Route params changed to:', params);
            this.productId = params['id'];
            this.initializeComponent();
        });
        if (this.productId) {
            console.log('Fetching product for ID:', this.productId);
            this._singleProductService.getProduct(this.productId).subscribe({
                next: (response) => {
                    console.log('Product fetched:', response.product);
                    this.product = response.product;
                    if (!this.product.comments) this.product.comments = [];
                    this.buildCommentTree();
                },
                error: (err) => console.error('Error:', err)
            });
            this._singleProductService.joinRoom(this.productId);
        }

        this.commentSub = this._singleProductService.getComments().subscribe((event: CommentEvent) => {
            console.log('Received comment event:', event);
            if (event.productId === this.productId) {
                this.product.comments.push(event.comment);
                this.addCommentToTree(event.comment);
            }
        });

        this.editSub = this._singleProductService.getCommentEdits().subscribe(event => {
            if (event.productId === this.productId) {
                this.updateCommentText(event.commentId, event.newText);
            }
        });

        this.deleteSub = this._singleProductService.getCommentDeletes().subscribe(event => {
            if (event.productId === this.productId) {
                this.removeCommentById(event.commentId);
            }
        });

        this.reactionSub = this._singleProductService.getCommentReactionUpdates().subscribe((data: any) => {
            if (data.productId === this.productId) {
                this.updateCommentReactions(data.commentId, data.likes, data.dislikes, data.loves);
            }
        });

        this.userReactionSub = this._singleProductService.getUserReactionUpdates().subscribe((data: any) => {
            if (data.productId === this.productId) {
                this.updateUserReaction(data.commentId, data.userReaction);
            }
        });
    }
    initializeComponent(): void {
        if (this.productId) {
            this._singleProductService.getProduct(this.productId).subscribe({
                next: (response) => {
                    console.log('Product fetched:', response.product);
                    this.product = response.product;
                    if (!this.product.comments) this.product.comments = [];
                    this.buildCommentTree();
                },
                error: (err) => console.error('Error:', err)
            });
            this._singleProductService.joinRoom(this.productId);
        }
    }

    buildCommentTree(): void {
        const commentMap: { [key: string]: Comment } = {};
        this.product.comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment._id] = comment;
        });
        this.commentTree = [];
        this.product.comments.forEach(comment => {
            if (comment.parentId && commentMap[comment.parentId]) {
                commentMap[comment.parentId].replies!.push(comment);
            } else {
                this.commentTree.push(comment);
            }
        });
        this.cd.detectChanges();
    }

    addCommentToTree(newComment: Comment): void {
        newComment.replies = [];
        const currentUser = this._authService.currentUserValue;
        if (currentUser) {
            newComment.userReaction = newComment.likers?.includes(currentUser.id) ? 'like' :
                newComment.dislikers?.includes(currentUser.id) ? 'dislike' :
                    newComment.lovers?.includes(currentUser.id) ? 'love' : null;
        }
        if (!newComment.parentId) {
            this.commentTree.push(newComment);
        } else {
            const parent = this.findCommentById(this.commentTree, newComment.parentId);
            if (parent) parent.replies!.push(newComment);
        }
        this.cd.detectChanges();
    }

    removeCommentById(commentId: string): void {
        const removeFromTree = (comments: Comment[]): boolean => {
            for (let i = comments.length - 1; i >= 0; i--) {
                if (comments[i]._id === commentId) {
                    comments.splice(i, 1);
                    return true;
                }
                if (comments[i].replies && removeFromTree(comments[i].replies!)) {
                    return true;
                }
            }
            return false;
        };
        removeFromTree(this.commentTree);
        this.product.comments = this.product.comments.filter(c => c._id !== commentId);
        this.cd.detectChanges();
    }

    updateCommentText(commentId: string, newText: string): void {
        const comment = this.findCommentById(this.commentTree, commentId);
        if (comment) {
            comment.text = newText;
            comment.edited = true;
            this.cd.detectChanges();
        }
    }

    updateCommentReactions(commentId: string, likes: number, dislikes: number, loves: number): void {
        const comment = this.findCommentById(this.commentTree, commentId);
        if (comment) {
            comment.likes = likes;
            comment.dislikes = dislikes;
            comment.loves = loves;
            this.cd.detectChanges();
        }
    }

    updateUserReaction(commentId: string, userReaction: 'like' | 'dislike' | 'love' | null): void {
        const comment = this.findCommentById(this.commentTree, commentId);
        if (comment) {
            comment.userReaction = userReaction;
            this.cd.detectChanges();
        }
    }

    findCommentById(comments: Comment[], id: string): Comment | null {
        for (const comment of comments) {
            if (comment._id === id) return comment;
            if (comment.replies) {
                const found = this.findCommentById(comment.replies, id);
                if (found) return found;
            }
        }
        return null;
    }
    setRating(value: number): void {
        this.selectedRating = value;
        console.log('Star clicked, selectedRating:', this.selectedRating);

    }

    onCommentSubmit(): void {
        console.log('Submitting new comment:', this.newComment.text, 'with rating:', this.selectedRating);
        if (this.productId && this.newComment.text) {
            this._singleProductService.sendComment(this.productId, this.newComment.text, null, this.selectedRating);
            this.newComment.text = '';
            this.selectedRating = 0;
        }
    }

    toggleReplyForm(comment: Comment): void {
        comment.showReplyForm = !comment.showReplyForm;
    }

    sendReply(comment: Comment): void {
        console.log('Sending reply:', comment.replyText, 'to comment:', comment._id);
        if (this.productId && comment.replyText) {
            this._singleProductService.sendComment(this.productId, comment.replyText, comment._id);
            comment.replyText = '';
            comment.showReplyForm = false;
        }
    }

    canEditOrDelete(comment: Comment): boolean {
        const currentUser = this._authService.currentUserValue;
        if (!currentUser) return false;
        const userId = typeof comment.user === 'string' ? comment.user : comment.user._id;
        return userId === currentUser.id || currentUser.isAdmin;
    }

    enableEdit(comment: Comment): void {
        comment.isEditing = true;
        comment.editText = comment.text;
    }

    deleteComment(comment: Comment): void {
        if (confirm('Are you sure you want to delete this comment and all its replies?')) {
            this._singleProductService.deleteComment(this.productId, comment._id);
        }
    }

    cancelEdit(comment: Comment): void {
        comment.isEditing = false;
        comment.editText = '';
    }

    submitEdit(comment: Comment): void {
        if (this.productId && comment.editText) {
            this._singleProductService.editComment(this.productId, comment._id, comment.editText);
            comment.isEditing = false;
        }
    }

    getUsername(user: any): string {
        if (typeof user === 'object') return user.username;
        if (typeof user === 'string') {
            const currentUser = this._authService.currentUserValue;
            return currentUser?.id === user ? currentUser.username : 'Unknown';
        }
        return 'Unknown';
    }

    likeComment(comment: Comment): void {
        if (this._authService.currentUserValue) {
            this._singleProductService.toggleLikeComment(this.productId, comment._id);
        } else {
            alert('You need to login to react to comments');
        }
    }

    dislikeComment(comment: Comment): void {
        if (this._authService.currentUserValue) {
            this._singleProductService.toggleDislikeComment(this.productId, comment._id);
        }
    }

    loveComment(comment: Comment): void {
        if (this._authService.currentUserValue) {
            this._singleProductService.toggleLoveComment(this.productId, comment._id);
        }
    }
    getUsernameClass(user: any): string {
        const username = this.getUsername(user);
        const firstLetter = username.charAt(0).toUpperCase();
        if (firstLetter >= 'A' && firstLetter <= 'E') {
            return 'bg-gray-100';
        } else if (firstLetter >= 'F' && firstLetter <= 'J') {
            return 'bg-yellow-100';
        } else if (firstLetter >= 'K' && firstLetter <= 'O') {
            return 'bg-blue-100';
        } else if (firstLetter >= 'P' && firstLetter <= 'T') {
            return 'bg-green-100';
        } else if (firstLetter >= 'U' && firstLetter <= 'Z') {
            return 'bg-purple-100';
        }
        return '';
    }
    getFirstLetter(user: any): string {
        const username = this.getUsername(user);
        return username.charAt(0).toUpperCase();
    }

    ngOnDestroy(): void {
        [this.commentSub, this.editSub, this.deleteSub, this.reactionSub, this.userReactionSub]
            .forEach(sub => sub?.unsubscribe());
    }
}