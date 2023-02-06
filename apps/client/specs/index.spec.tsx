import React from 'react';
import { render } from '@testing-library/react';
import { Post } from '@prisma/client';
import Index from '../pages/index';

describe('Index', () => {
  it('should render successfully', () => {
    const data = {
      message: 'Hello World',
    };

    const dbData: Post[] = [
      {
        id: 1,
        title: 'First Post',
        content: 'This is my first post',
        authorId: 1,
        createdAt: new Date(),
        published: true,
      }
    ];

    const { baseElement } = render(<Index data={data} dbData={dbData} />);
    expect(baseElement).toBeTruthy();
  });
});
