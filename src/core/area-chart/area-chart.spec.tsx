import React from 'react'
import { render, screen } from '@testing-library/react'

describe('Browse Component', () => {
    it('should render "First chart test!"', () => {
        render(<div>First chart test!</div>)

        const browse = screen.queryByText('First chart test!')

        expect(browse).toBeDefined()
    })
})
