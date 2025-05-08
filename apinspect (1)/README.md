# APInspect: API Testing Tool

APInspect is a comprehensive API testing tool designed to help developers test, debug, and document their APIs. It provides a user-friendly interface for sending HTTP requests, viewing responses, managing collections, and much more.

## Key Features

- HTTP request builder with support for all methods
- Response viewer with JSON formatting
- Environment variables management
- Request collections and history
- Authentication support (Basic, Bearer, API Key, OAuth)
- Test scripts for response validation
- Code snippet generation

## Technologies Used

- React with Next.js framework
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI components
- Local storage for data persistence
- Fetch API for HTTP requests

## Getting Started

To use APInspect, simply enter a URL in the request builder, select the HTTP method, and click "Send". You can add headers, query parameters, and a request body as needed. The response will be displayed in the response viewer below.

For more advanced features, explore the various tools in the toolbar, such as the environment manager, collections, and test interface.

## Features

### Request Builder

The request builder allows you to create and send HTTP requests with various methods, headers, parameters, and body content.

- Support for GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS methods
- URL input with environment variable support
- Query parameters editor
- Headers editor
- Body editor with support for JSON, XML, form data, and URL-encoded data
- File upload support for multipart/form-data

### Response Viewer

The response viewer displays the response from the API, including status code, headers, and body content.

- Status code and status text display
- Response time and size metrics
- Headers viewer
- Body viewer with JSON formatting
- Loading state during request

### Environment Manager

The environment manager allows you to define and use variables in your requests, making it easy to switch between different environments (e.g., development, staging, production).

- Global variables available in all environments
- Environment-specific variables
- Variable substitution in URLs, headers, parameters, and body content
- Easy switching between environments

### Collections and History

Collections allow you to save and organize your requests, while history keeps track of your recent requests.

- Create and manage collections
- Save requests to collections
- View and load requests from history
- Automatic history tracking

### Authentication

APInspect supports various authentication methods for API requests.

- Basic authentication with username and password
- Bearer token authentication
- API key authentication (in header or query parameter)
- OAuth 2.0 authentication

### Test Interface

The test interface allows you to write and run tests against API responses to validate their correctness.

- Create and manage test scripts
- Write tests using a simple JavaScript-like syntax
- Validate status codes, headers, and response body
- Run tests against responses
- View test results with pass/fail status

### Code Generator

The code generator creates code snippets for your requests in various programming languages.

- Generate code for JavaScript, Python, cURL, PHP, and Java
- Includes headers, authentication, and body content
- Copy code to clipboard

## Components

APInspect is built with a modular architecture, with each feature implemented as a separate component:

- **RequestBuilder**: Creates and configures HTTP requests
- **ResponseViewer**: Displays the response from an API request
- **EnvironmentManager**: Manages environment variables for requests
- **CollectionManager**: Manages collections of saved requests
- **AuthManager**: Handles authentication configuration for requests
- **TestInterface**: Creates and runs tests against API responses
- **CodeGenerator**: Generates code snippets for requests
- **BodyEditor**: Edits request body content
- **HistoryViewer**: Displays and manages request history

## Project Structure

```
apinspect/
├── app/
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout with theme provider
│   └── globals.css        # Global styles
├── components/
│   ├── request-builder.tsx
│   ├── response-viewer.tsx
│   ├── environment-manager.tsx
│   ├── collection-manager.tsx
│   ├── auth-manager.tsx
│   ├── test-interface.tsx
│   ├── code-generator.tsx
│   ├── body-editor.tsx
│   ├── headers-editor.tsx
│   ├── params-editor.tsx
│   ├── history-viewer.tsx
│   ├── sidebar.tsx
│   ├── theme-toggle.tsx
│   └── documentation.tsx
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── environment-utils.ts # Environment variable utilities
│   ├── form-data-utils.ts # Form data handling utilities
│   └── storage.ts         # Local storage utilities
└── components/ui/         # UI components from shadcn/ui
```

## Data Flow

APInspect uses a unidirectional data flow pattern:

1. **State Management**: The main state is managed in the root component (page.tsx) and passed down to child components via props.
2. **User Interactions**: User interactions trigger callbacks that update the state in the parent component.
3. **Data Persistence**: State changes are persisted to local storage using the storage utilities.
4. **API Requests**: Requests are sent using the Fetch API, with request data processed by utility functions.

## Local Storage

APInspect uses local storage to persist data between sessions:

- **apinspect-collections**: Saved request collections
- **apinspect-environments**: Environment configurations
- **apinspect-history**: Request history
- **apinspect-tests**: Test scripts
- **apinspect-active-env**: Active environment ID
- **apinspect-theme**: UI theme preference

## Future Enhancements

Potential areas for future development:

- WebSocket support for real-time API testing
- Import/export functionality for collections and environments
- GraphQL support with query builder
- Response visualization tools (charts, tables)
- Certificate manager for HTTPS requests
- Team collaboration features
- Request comparison tool
- Performance testing capabilities
- API documentation generation
