'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightLong } from '@/svg';
import { useTranslation } from 'react-i18next';

const BlogItem = ({blog}) => {
  const { t } = useTranslation('common');
  return (
    <div className="tp-blog-item mb-30">
      <div className="tp-blog-thumb p-relative fix">
        <Link href={`/blog-details/${blog.id}`}>
          <Image src={blog.img} alt="blog img" style={{width:'100%',height:'100%'}} />
        </Link>
        <div className="tp-blog-meta tp-blog-meta-date">
          <span>{blog.date}</span>
        </div>
      </div>
      <div className="tp-blog-content">
        <h3 className="tp-blog-title">
          <Link href={`/blog-details/${blog.id}`}>{blog.title}</Link>
        </h3>

        <div className="tp-blog-tag">
          <span><i className="fa-light fa-tag"></i></span>
          {blog.tags.map((tag, i) => (
            <a key={i} href="#">
              {tag}{i < blog.tags.length - 1 ? ',' : ''}
            </a>
          ))}
        </div>

        <p>{blog.sm_desc}</p>

        <div className="tp-blog-btn">
          <Link href={`/blog-details/${blog.id}`} className="tp-btn-2 tp-btn-border-2">
            {t('home.blog.readMore')}
            <span>
              <ArrowRightLong />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;