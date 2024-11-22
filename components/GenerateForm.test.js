import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Correct import for jest-dom
import GenerateForm from './GenerateForm';

describe('GenerateForm', () => {
  test('renders the form with the correct title', () => {
    render(<GenerateForm title="Test Title" result="" message="" />);
    const titleElement = screen.getByText(/Test Title/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('displays the result message correctly', () => {
    const resultMessage = "Test result message";
    render(<GenerateForm title="Test Title" result={resultMessage} message="" />);
    const resultElement = screen.getByText(resultMessage);
    expect(resultElement).toBeInTheDocument();
  });
});