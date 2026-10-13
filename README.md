# Treasury Budget App

A web application for creating, visualizing and managing forecast cash flow budgets.

The application helps structure financial forecasts over a configurable period and provides a clear overview of expected cash flows, VAT and treasury evolution.

## Features

- Create forecast budgets from 2 to 12 months
- Configure:
  - Starting month and year
  - Initial treasury balance
  - Initial VAT credit
- Manage multiple budgets
- View detailed budget information
- Cash flow forecasting
- VAT calculation and monitoring
- Cash inflow and outflow tables
- Financial summary
- Treasury evolution chart
- Export budgets to PDF
- Export data to Excel
- Responsive interface

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Lucide React

## Project Structure

The application is organized around reusable React components and a shared budget context for state management.

Main components include:

- `BudgetForm` — creation and configuration of a budget
- `BudgetList` — list and management of existing budgets
- `BudgetDetail` — detailed budget view
- `ForecastTable` — financial forecasts
- `VATTable` — VAT calculations
- `CashFlowTables` — cash inflows and outflows
- `SummaryTable` — budget summary
- `CashFlowChart` — graphical visualization of treasury evolution

## Notes

This version is a client-side application and does not rely on a backend or external database.

## Getting Started

```bash
npm install
npm run dev
