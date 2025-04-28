import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    const fetchComments = async () => {
        try {
            const res = await api.get(`/api/tasks/${taskId}`);
            setComments(res.data.data.comments || []);
        } catch (err) {
            setError('Failed to load comments');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await api.post(`/api/tasks/${taskId}/comments`, { text: newComment });
            setComments(res.data.data);
            setNewComment('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-4">
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="form-group mb-2">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="form-input h-20"
                            placeholder="Add a comment..."
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>

                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-gray-500 text-center">No comments yet</p>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={index} className="border-b pb-3 last:border-b-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium">
                                        {comment.user === currentUser.id ? 'You' : 'Collaborator'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-700">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentSection;