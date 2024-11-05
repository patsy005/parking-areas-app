# Parking areas management app

This is a parking areas management app that allows to create, edit, delete parking area. It calculates fees based on the selected parking area, parking duration, day of the week and applicable discounts. The application also supports currency conversion between USD, EUR and PLN.

The application has two main views:

1. Parking Areas Management: Users can create, edit, delete, sort and search for parking areas.
2. Payment view: Calculates the parking fee based on selected parking area, parking start and end time, parking day and choosen currency. The base currency is USD with support for conversions to EUR and PLN. Billing day is the day of calculation.

## Table of contents

- [Links](#links)
  - [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment Variables](#environment-variables)
- [License](#license)
- [Author](#author)
- [Design](#design)

### Links

- Solution URL: [https://github.com/patsy005/parking-areas-app](https://github.com/patsy005/parking-areas-app)

### Tech stack

Frontend:

- React.js (Vite, React Router)
- TypeScript
- React Hook Form
- React Select
- React Datepicker
- Redux
- Toaster
  Backend:
- Node.js
- RavenDB
  External APIs:
- [https://www.fastforex.io/](https://www.fastforex.io/)

### Getting started

1. Clone the repository
2. Run `npm install`
3. Ensure you have a running instance of RavenDB
4. Add `.env` file in the root repository
5. Import data with `npm import`
6. Run the server with `npm start`

### Environment Variables

The following variables are required in the `.env` file:

- `REACT_APP_API_URL`: URL to your RavenDB
- `RAVENDB_CERTIFICATE_PASSWORD`: RavenDB certificate password
- `RAVEN_CLIENT_CERTIFICATE_PATH`: RavenDB certificate path
- `PORT`: Port number for the local server

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

## Author

- LinkedIn [Patrycja Zawadzka](https://www.linkedin.com/in/patrycja-zawadzka-786836217/)

## Design

- Designed in Figma

![](./design/Parking%20Areas.png)
![](./design/Tablet%20payment.png)
![](./design/Mobile-Parking%20areas-%20edit.png)
