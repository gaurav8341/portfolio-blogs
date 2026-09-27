import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import Mermaid from './Mermaid';
import ReadingProgress from './ReadingProgress';
import { SkeletonLine } from './Skeleton';
import '../css/BlogDetail.css';
import { readingTime } from './utils';

const BlogDetail = ({ blogPaths, blogs }) => {
    const { id } = useParams();
    const [content, setContent] = useState(null);
    const meta = (blogs || []).find((blog) => blog.id === id);

    useEffect(() => {
        const fetchBlogContent = async () => {
            try {
                const blogPath = blogPaths[id];
                if (!blogPath) {
                    throw new Error('Blog not found');
                }

                axios.get(blogPath).then((response) => {
                    setContent(response.data);
                });
            } catch (error) {
                console.error(error);
                setContent(null);
            }
        };

        if (Object.keys(blogPaths).length > 0) {
            fetchBlogContent();
        }
    }, [id, blogPaths]);

    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match && match[1] === 'mermaid' ? (
                <Mermaid chart={String(children).replace(/\n$/, '')} />
            ) : (
                <pre>
                    <code className={className} {...props}>
                        {children}
                    </code>
                </pre>
            );
        }
    };

    // The markdown source already starts with an H1 matching the title shown
    // in the meta header below, so drop that leading line to avoid showing it twice.
    const body = content ? content.replace(/^#\s+.+\n+/, '') : content;

    return (
        <>
            <ReadingProgress />
            <div className="blog-detail">
                <Link to="/blogs" className="back-link anim anim-fade-in">
                    <span className="back-arrow">←</span> Back to blog
                </Link>
                {meta && (
                    <>
                        <h1 className="blog-detail-title anim anim-fade-up" style={{ '--delay': '60ms' }}>{meta.title}</h1>
                        <div className="blog-detail-meta anim anim-fade-up" style={{ '--delay': '140ms' }}>
                            <span>{meta.date}</span>
                            {content && (
                                <>
                                    <span>·</span>
                                    <span>{readingTime(content)} min read</span>
                                </>
                            )}
                            {meta.tags && meta.tags.length > 0 && (
                                <>
                                    <span>·</span>
                                    <span>{meta.tags.join(', ')}</span>
                                </>
                            )}
                        </div>
                    </>
                )}
                <div className="blog-detail-body">
                    {content ? (
                        <div className="anim anim-fade-up">
                            <ReactMarkdown components={components}>{body}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="blog-detail-loading" role="status" aria-label="Loading article">
                            {['96%', '100%', '88%', '92%', '64%', '100%', '78%'].map((width, index) => (
                                <SkeletonLine
                                    key={index}
                                    width={width}
                                    height={15}
                                    style={{ marginBottom: index === 3 ? 28 : 14 }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogDetail;
