// Gemini function declarations for function-calling
export const TOOL_DECLARATIONS = [
  {
    name: 'find_route',
    description:
      'Find a walking route inside MetLife Stadium between two locations (gates, sections, concourses, amenities). Returns step-by-step instructions.',
    parameters: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          description: 'Origin location, e.g. "Gate A", "Section 110", "Elevator 1"',
        },
        to: {
          type: 'string',
          description: 'Destination location, e.g. "Section 300", "Food stand near Section 200"',
        },
        accessible: {
          type: 'boolean',
          description: 'If true, returns only wheelchair/mobility-accessible routes via elevators',
        },
        crowd_aware: {
          type: 'boolean',
          description: 'If true, routes around high-density crowd areas',
        },
      },
      required: ['from', 'to'],
    },
  },
  {
    name: 'find_nearest_amenity',
    description:
      'Find the nearest amenity of a given type (food, restroom, medical, security, merchandise) from a section.',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['food', 'restroom', 'medical', 'security', 'merchandise'],
          description: 'Type of amenity to find',
        },
        from_section: {
          type: 'string',
          description: 'The section number or name the fan is currently in, e.g. "110" or "Section 110"',
        },
      },
      required: ['type', 'from_section'],
    },
  },
  {
    name: 'get_crowd_status',
    description:
      'Get current crowd density information for the stadium or a specific section. Includes wait time estimates and alternate recommendations.',
    parameters: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          description: 'Optional specific section to query, e.g. "100". If omitted, returns all sections.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_transport_info',
    description:
      'Get information about nearby transportation options including rail, bus, rideshare pickup zones, and driving directions.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_section_info',
    description: 'Get metadata about a specific stadium section including level, zone, and accessibility.',
    parameters: {
      type: 'object',
      properties: {
        section: {
          type: 'string',
          description: 'Section identifier, e.g. "110" or "Section 300"',
        },
      },
      required: ['section'],
    },
  },
  {
    name: 'get_parking_info',
    description: 'Get parking lot information including accessible spaces and nearest gates.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];
