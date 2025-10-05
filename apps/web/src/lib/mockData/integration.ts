import {
  Integration,
  APIEndpoint,
  DataSource,
  DataWarehouse,
  Dashboard,
  Report,
  PredictiveModel,
  DataPipeline,
  Alert,
  APIKey,
  SystemConnector,
  IntegrationStats
} from '../../types/integration';

export const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Epic EHR Integration',
    type: 'ehr',
    description: 'Real-time patient data synchronization with Epic EHR system',
    status: 'active',
    provider: 'Epic Systems',
    version: '2.1.0',
    endpoint: 'https://api.epic.com/v1/',
    dataDirection: 'bidirectional',
    authMethod: 'oauth2',
    lastSync: '2024-01-15T14:30:00Z',
    createdAt: '2023-12-01T10:00:00Z',
    settings: {
      syncInterval: '5 minutes',
      retryCount: 3,
      timeout: 30000,
      enableWebhooks: true
    },
    metrics: {
      totalRequests: 15420,
      successRate: 99.2,
      averageResponseTime: 245,
      errorCount: 12
    }
  },
  {
    id: '2',
    name: 'Stripe Payment Gateway',
    type: 'payment',
    description: 'Payment processing for billing and insurance claims',
    status: 'active',
    provider: 'Stripe',
    version: '3.0.2',
    endpoint: 'https://api.stripe.com/v1/',
    dataDirection: 'bidirectional',
    authMethod: 'api_key',
    lastSync: '2024-01-15T14:25:00Z',
    createdAt: '2023-11-15T09:30:00Z',
    settings: {
      syncInterval: 'real-time',
      retryCount: 5,
      timeout: 15000,
      enableWebhooks: true
    },
    metrics: {
      totalRequests: 8750,
      successRate: 99.8,
      averageResponseTime: 180,
      errorCount: 3
    }
  },
  {
    id: '3',
    name: 'Lab Results API',
    type: 'lab',
    description: 'Laboratory results integration with Quest Diagnostics',
    status: 'warning',
    provider: 'Quest Diagnostics',
    version: '1.5.1',
    endpoint: 'https://api.quest.com/lab/',
    dataDirection: 'inbound',
    authMethod: 'jwt',
    lastSync: '2024-01-15T13:45:00Z',
    createdAt: '2023-10-20T16:00:00Z',
    settings: {
      syncInterval: '15 minutes',
      retryCount: 3,
      timeout: 45000,
      enableWebhooks: false
    },
    metrics: {
      totalRequests: 5240,
      successRate: 96.5,
      averageResponseTime: 720,
      errorCount: 45
    }
  },
  {
    id: '4',
    name: 'PACS Imaging System',
    type: 'imaging',
    description: 'Medical imaging data synchronization',
    status: 'active',
    provider: 'GE Healthcare',
    version: '4.2.0',
    endpoint: 'https://pacs.gehealthcare.com/api/',
    dataDirection: 'inbound',
    authMethod: 'basic',
    lastSync: '2024-01-15T14:20:00Z',
    createdAt: '2023-09-10T12:15:00Z',
    settings: {
      syncInterval: '30 minutes',
      retryCount: 2,
      timeout: 60000,
      enableWebhooks: true
    },
    metrics: {
      totalRequests: 3680,
      successRate: 98.7,
      averageResponseTime: 1250,
      errorCount: 8
    }
  },
  {
    id: '5',
    name: 'Pharmacy Management',
    type: 'pharmacy',
    description: 'Medication orders and inventory management',
    status: 'error',
    provider: 'CVS Health',
    version: '2.3.1',
    endpoint: 'https://api.cvs.com/pharmacy/',
    dataDirection: 'bidirectional',
    authMethod: 'api_key',
    lastSync: '2024-01-15T11:30:00Z',
    createdAt: '2023-08-05T14:45:00Z',
    settings: {
      syncInterval: '10 minutes',
      retryCount: 4,
      timeout: 25000,
      enableWebhooks: true
    },
    metrics: {
      totalRequests: 2150,
      successRate: 85.2,
      averageResponseTime: 450,
      errorCount: 78
    }
  }
];

export const mockAPIEndpoints: APIEndpoint[] = [
  {
    id: '1',
    path: '/api/v1/patients',
    method: 'GET',
    version: 'v1',
    description: 'Retrieve patient information',
    status: 'active',
    requiresAuth: true,
    authType: 'Bearer Token',
    rateLimit: {
      requests: 1000,
      period: 'hour'
    },
    parameters: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Patient ID'
      },
      {
        name: 'include',
        type: 'array',
        required: false,
        description: 'Additional data to include'
      }
    ],
    responseSchema: {},
    examples: [],
    usage: {
      totalCalls: 24580,
      lastCalled: '2024-01-15T14:28:00Z',
      popularityScore: 95
    }
  },
  {
    id: '2',
    path: '/api/v1/appointments',
    method: 'POST',
    version: 'v1',
    description: 'Create new appointment',
    status: 'active',
    requiresAuth: true,
    authType: 'API Key',
    rateLimit: {
      requests: 500,
      period: 'hour'
    },
    parameters: [
      {
        name: 'patient_id',
        type: 'string',
        required: true,
        description: 'Patient identifier'
      },
      {
        name: 'provider_id',
        type: 'string',
        required: true,
        description: 'Healthcare provider ID'
      },
      {
        name: 'datetime',
        type: 'datetime',
        required: true,
        description: 'Appointment date and time'
      }
    ],
    responseSchema: {},
    examples: [],
    usage: {
      totalCalls: 12450,
      lastCalled: '2024-01-15T14:15:00Z',
      popularityScore: 87
    }
  },
  {
    id: '3',
    path: '/api/v1/lab-results',
    method: 'GET',
    version: 'v1',
    description: 'Retrieve laboratory test results',
    status: 'active',
    requiresAuth: true,
    authType: 'JWT',
    rateLimit: {
      requests: 2000,
      period: 'hour'
    },
    parameters: [
      {
        name: 'patient_id',
        type: 'string',
        required: true,
        description: 'Patient ID'
      },
      {
        name: 'test_type',
        type: 'string',
        required: false,
        description: 'Type of lab test'
      }
    ],
    responseSchema: {},
    examples: [],
    usage: {
      totalCalls: 8960,
      lastCalled: '2024-01-15T14:05:00Z',
      popularityScore: 78
    }
  },
  {
    id: '4',
    path: '/api/v1/billing',
    method: 'PUT',
    version: 'v1',
    description: 'Update billing information',
    status: 'warning',
    requiresAuth: true,
    authType: 'OAuth 2.0',
    rateLimit: {
      requests: 200,
      period: 'hour'
    },
    parameters: [
      {
        name: 'invoice_id',
        type: 'string',
        required: true,
        description: 'Invoice identifier'
      },
      {
        name: 'amount',
        type: 'number',
        required: true,
        description: 'Billing amount'
      }
    ],
    responseSchema: {},
    examples: [],
    usage: {
      totalCalls: 3240,
      lastCalled: '2024-01-15T13:45:00Z',
      popularityScore: 45
    }
  }
];

export const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'Patient Database',
    type: 'database',
    status: 'active',
    connectionString: 'postgresql://***:***@localhost:5432/patients',
    provider: 'PostgreSQL',
    location: 'Primary Data Center',
    schema: {
      tables: [
        {
          name: 'patients',
          columns: [
            { name: 'id', type: 'uuid', nullable: false },
            { name: 'first_name', type: 'varchar', nullable: false },
            { name: 'last_name', type: 'varchar', nullable: false }
          ]
        }
      ]
    },
    metrics: {
      size: '2.4 TB',
      recordCount: 1250000,
      lastUpdated: '2024-01-15T14:00:00Z'
    },
    access: {
      readOnly: false,
      encryptionEnabled: true,
      backupEnabled: true
    }
  },
  {
    id: '2',
    name: 'Clinical Data Warehouse',
    type: 'database',
    status: 'active',
    connectionString: 'snowflake://***@hospital.snowflakecomputing.com/',
    provider: 'Snowflake',
    location: 'Cloud (US-East)',
    schema: {
      tables: [
        {
          name: 'encounters',
          columns: [
            { name: 'encounter_id', type: 'varchar', nullable: false },
            { name: 'patient_id', type: 'varchar', nullable: false }
          ]
        }
      ]
    },
    metrics: {
      size: '15.8 TB',
      recordCount: 8500000,
      lastUpdated: '2024-01-15T13:30:00Z'
    },
    access: {
      readOnly: true,
      encryptionEnabled: true,
      backupEnabled: true
    }
  },
  {
    id: '3',
    name: 'Lab Results Feed',
    type: 'stream',
    status: 'active',
    connectionString: 'kafka://lab-stream.internal:9092',
    provider: 'Apache Kafka',
    location: 'Lab Network',
    schema: {
      tables: [
        {
          name: 'lab_results',
          columns: [
            { name: 'test_id', type: 'varchar', nullable: false },
            { name: 'result_value', type: 'decimal', nullable: true }
          ]
        }
      ]
    },
    metrics: {
      size: '450 GB',
      recordCount: 2400000,
      lastUpdated: '2024-01-15T14:25:00Z'
    },
    access: {
      readOnly: true,
      encryptionEnabled: false,
      backupEnabled: false
    }
  }
];

export const mockDataWarehouses: DataWarehouse[] = [
  {
    id: '1',
    name: 'Clinical Data Warehouse',
    provider: 'Snowflake',
    region: 'us-east-1',
    size: '50 TB',
    status: 'active',
    configuration: {
      computeUnits: 8,
      storageType: 'SSD',
      backupRetention: '90 days'
    },
    schemas: [
      { name: 'patient_data', tableCount: 45, sizeGB: 18000 },
      { name: 'clinical_notes', tableCount: 12, sizeGB: 25000 },
      { name: 'billing', tableCount: 8, sizeGB: 7000 }
    ],
    costs: {
      monthly: 12500,
      storage: 4500,
      compute: 8000
    },
    performance: {
      averageQueryTime: 2.4,
      concurrentQueries: 25,
      cacheHitRate: 85
    }
  },
  {
    id: '2',
    name: 'Analytics Warehouse',
    provider: 'BigQuery',
    region: 'us-central1',
    size: '25 TB',
    status: 'active',
    configuration: {
      computeUnits: 4,
      storageType: 'Standard',
      backupRetention: '30 days'
    },
    schemas: [
      { name: 'reporting', tableCount: 22, sizeGB: 12000 },
      { name: 'ml_features', tableCount: 18, sizeGB: 13000 }
    ],
    costs: {
      monthly: 6800,
      storage: 2800,
      compute: 4000
    },
    performance: {
      averageQueryTime: 1.8,
      concurrentQueries: 15,
      cacheHitRate: 92
    }
  }
];

export const mockDashboards: Dashboard[] = [
  {
    id: '1',
    title: 'Executive Healthcare Dashboard',
    description: 'High-level KPIs and metrics for hospital operations',
    category: 'Executive',
    owner: 'John Smith',
    isPublic: false,
    thumbnail: '/images/dashboard-executive.png',
    widgets: [],
    dataSource: 'clinical_warehouse',
    refreshInterval: '5 minutes',
    lastUpdated: '2024-01-15T14:20:00Z',
    createdAt: '2023-12-01T09:00:00Z',
    permissions: [
      { userId: 'exec1', role: 'viewer' },
      { userId: 'exec2', role: 'editor' }
    ]
  },
  {
    id: '2',
    title: 'Patient Flow Analytics',
    description: 'Real-time patient flow and capacity management',
    category: 'Operations',
    owner: 'Sarah Johnson',
    isPublic: true,
    thumbnail: '/images/dashboard-flow.png',
    widgets: [],
    dataSource: 'operational_db',
    refreshInterval: '1 minute',
    lastUpdated: '2024-01-15T14:15:00Z',
    createdAt: '2023-11-20T10:30:00Z',
    permissions: [
      { userId: 'ops1', role: 'editor' },
      { userId: 'nurse1', role: 'viewer' }
    ]
  },
  {
    id: '3',
    title: 'Quality Metrics Dashboard',
    description: 'Patient safety and quality indicators',
    category: 'Quality',
    owner: 'Dr. Michael Chen',
    isPublic: false,
    widgets: [],
    dataSource: 'quality_db',
    refreshInterval: '30 minutes',
    lastUpdated: '2024-01-15T13:45:00Z',
    createdAt: '2023-10-15T14:15:00Z',
    permissions: [
      { userId: 'quality1', role: 'editor' }
    ]
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Financial Summary',
    description: 'Comprehensive financial report for hospital operations',
    category: 'Financial',
    format: 'PDF',
    schedule: 'Monthly',
    recipients: ['cfo@hospital.com', 'finance-team@hospital.com'],
    parameters: [
      { name: 'month', type: 'date', defaultValue: 'current' },
      { name: 'department', type: 'string', defaultValue: 'all' }
    ],
    query: 'SELECT * FROM financial_summary WHERE month = ?',
    lastGenerated: '2024-01-01T09:00:00Z',
    nextRun: '2024-02-01T09:00:00Z',
    status: 'active',
    outputLocation: '/reports/financial/'
  },
  {
    id: '2',
    name: 'Patient Satisfaction Survey',
    description: 'Weekly patient satisfaction metrics and feedback',
    category: 'Quality',
    format: 'EXCEL',
    schedule: 'Weekly',
    recipients: ['quality@hospital.com'],
    parameters: [
      { name: 'week', type: 'date', defaultValue: 'last_week' }
    ],
    query: 'SELECT * FROM satisfaction_scores WHERE week = ?',
    lastGenerated: '2024-01-08T10:00:00Z',
    nextRun: '2024-01-15T10:00:00Z',
    status: 'active',
    outputLocation: '/reports/quality/'
  },
  {
    id: '3',
    name: 'Clinical Performance Report',
    description: 'Daily clinical outcomes and performance metrics',
    category: 'Clinical',
    format: 'CSV',
    schedule: 'Daily',
    recipients: ['clinical-directors@hospital.com'],
    parameters: [
      { name: 'date', type: 'date', defaultValue: 'yesterday' }
    ],
    query: 'SELECT * FROM clinical_metrics WHERE date = ?',
    lastGenerated: '2024-01-14T23:00:00Z',
    nextRun: '2024-01-15T23:00:00Z',
    status: 'active',
    outputLocation: '/reports/clinical/'
  }
];

export const mockPredictiveModels: PredictiveModel[] = [
  {
    id: '1',
    name: 'Readmission Risk Prediction',
    description: 'Predicts patient readmission risk within 30 days',
    modelType: 'classification',
    framework: 'scikit-learn',
    version: '2.1.0',
    status: 'active',
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.87,
    f1Score: 0.88,
    lastTrained: '2024-01-10T08:00:00Z',
    trainingDataset: {
      name: 'patient_outcomes_2023',
      size: 50000,
      features: ['age', 'diagnosis', 'length_of_stay', 'comorbidities']
    },
    deployment: {
      endpoint: '/api/ml/readmission-risk',
      instances: 3,
      maxConcurrency: 100
    },
    metrics: {
      predictionsToday: 245,
      averageLatency: 15,
      errorRate: 0.008
    }
  },
  {
    id: '2',
    name: 'Length of Stay Prediction',
    description: 'Estimates patient length of stay for capacity planning',
    modelType: 'regression',
    framework: 'TensorFlow',
    version: '1.8.2',
    status: 'active',
    accuracy: 0.85,
    precision: 0.83,
    recall: 0.81,
    f1Score: 0.82,
    lastTrained: '2024-01-05T12:00:00Z',
    trainingDataset: {
      name: 'encounter_data_2023',
      size: 75000,
      features: ['admission_type', 'primary_diagnosis', 'age', 'severity_index']
    },
    deployment: {
      endpoint: '/api/ml/length-of-stay',
      instances: 2,
      maxConcurrency: 50
    },
    metrics: {
      predictionsToday: 186,
      averageLatency: 22,
      errorRate: 0.012
    }
  },
  {
    id: '3',
    name: 'Disease Risk Assessment',
    description: 'Identifies patients at risk for chronic disease development',
    modelType: 'classification',
    framework: 'PyTorch',
    version: '3.2.1',
    status: 'training',
    accuracy: 0.88,
    precision: 0.86,
    recall: 0.84,
    f1Score: 0.85,
    lastTrained: '2024-01-12T16:00:00Z',
    trainingDataset: {
      name: 'risk_factors_2023',
      size: 120000,
      features: ['lab_values', 'vital_signs', 'family_history', 'lifestyle_factors']
    },
    deployment: {
      endpoint: '/api/ml/disease-risk',
      instances: 1,
      maxConcurrency: 25
    },
    metrics: {
      predictionsToday: 98,
      averageLatency: 35,
      errorRate: 0.015
    }
  }
];

export const mockDataPipelines: DataPipeline[] = [
  {
    id: '1',
    name: 'Patient Data ETL',
    description: 'Extract, transform, and load patient data from EHR systems',
    source: 'Epic EHR',
    destination: 'Clinical Data Warehouse',
    frequency: 'Every 15 minutes',
    status: 'active',
    lastRun: '2024-01-15T14:15:00Z',
    nextRun: '2024-01-15T14:30:00Z',
    steps: [
      {
        id: 'extract',
        name: 'Extract from EHR',
        type: 'extraction',
        configuration: {},
        status: 'completed',
        duration: 45
      },
      {
        id: 'transform',
        name: 'Data Transformation',
        type: 'transformation',
        configuration: {},
        status: 'completed',
        duration: 120
      },
      {
        id: 'load',
        name: 'Load to Warehouse',
        type: 'loading',
        configuration: {},
        status: 'completed',
        duration: 30
      }
    ],
    metrics: {
      recordsProcessed: 15420,
      successRate: 99.2,
      averageDuration: 195
    },
    dataQuality: {
      completeness: 98.5,
      accuracy: 99.1,
      consistency: 97.8
    }
  },
  {
    id: '2',
    name: 'Lab Results Pipeline',
    description: 'Real-time processing of laboratory test results',
    source: 'Lab System API',
    destination: 'Analytics Warehouse',
    frequency: 'Real-time',
    status: 'active',
    lastRun: '2024-01-15T14:28:00Z',
    nextRun: 'Continuous',
    steps: [
      {
        id: 'validate',
        name: 'Validate Results',
        type: 'validation',
        configuration: {},
        status: 'completed',
        duration: 5
      },
      {
        id: 'enrich',
        name: 'Enrich with Metadata',
        type: 'enrichment',
        configuration: {},
        status: 'completed',
        duration: 8
      },
      {
        id: 'store',
        name: 'Store Results',
        type: 'storage',
        configuration: {},
        status: 'completed',
        duration: 3
      }
    ],
    metrics: {
      recordsProcessed: 8960,
      successRate: 99.8,
      averageDuration: 16
    },
    dataQuality: {
      completeness: 99.9,
      accuracy: 99.7,
      consistency: 99.2
    }
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'High Error Rate Detected',
    message: 'Pharmacy integration showing error rate above 15% in the last hour',
    severity: 'high',
    type: 'system',
    source: 'Pharmacy Management',
    timestamp: '2024-01-15T14:20:00Z',
    status: 'open',
    assignedTo: 'it-ops@hospital.com',
    tags: ['integration', 'pharmacy', 'error-rate']
  },
  {
    id: '2',
    title: 'Data Quality Issue',
    message: 'Patient records showing 5% increase in missing required fields',
    severity: 'medium',
    type: 'data_quality',
    source: 'Patient Data ETL',
    timestamp: '2024-01-15T13:45:00Z',
    status: 'acknowledged',
    assignedTo: 'data-team@hospital.com',
    tags: ['data-quality', 'patients', 'etl']
  },
  {
    id: '3',
    title: 'Performance Degradation',
    message: 'API response times exceeded threshold for lab results endpoint',
    severity: 'medium',
    type: 'performance',
    source: 'Lab Results API',
    timestamp: '2024-01-15T12:30:00Z',
    status: 'resolved',
    resolution: 'Increased server capacity and optimized database queries',
    tags: ['performance', 'api', 'lab-results']
  }
];

export const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Mobile App Integration',
    keyType: 'production',
    permissions: ['read:patients', 'write:appointments'],
    created: '2023-12-01T10:00:00Z',
    lastUsed: '2024-01-15T14:25:00Z',
    isActive: true,
    usage: {
      requestCount: 125420,
      remainingQuota: 874580
    }
  },
  {
    id: '2',
    name: 'Development Testing',
    keyType: 'development',
    permissions: ['read:*', 'write:test-data'],
    created: '2024-01-01T09:00:00Z',
    lastUsed: '2024-01-15T11:30:00Z',
    isActive: true,
    usage: {
      requestCount: 8945,
      remainingQuota: 991055
    }
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    keyType: 'production',
    permissions: ['read:analytics', 'read:reports'],
    created: '2023-11-15T14:30:00Z',
    lastUsed: '2024-01-15T13:15:00Z',
    isActive: true,
    usage: {
      requestCount: 45680,
      remainingQuota: 454320
    }
  }
];

export const mockSystemConnectors: SystemConnector[] = [
  {
    id: '1',
    name: 'Epic EHR Connector',
    type: 'EHR',
    vendor: 'Epic Systems',
    version: '2.1.0',
    status: 'active',
    endpoint: 'https://api.epic.com/v1/',
    lastSync: '2024-01-15T14:30:00Z',
    dataMapping: [
      {
        source: 'patient.firstName',
        destination: 'first_name',
        transformation: 'uppercase'
      },
      {
        source: 'patient.lastName',
        destination: 'last_name',
        transformation: 'uppercase'
      }
    ],
    errorHandling: {
      retryCount: 3,
      backoffStrategy: 'exponential',
      fallbackAction: 'queue_for_manual_review'
    }
  }
];

export const mockIntegrationStats: IntegrationStats = {
  activeIntegrations: 12,
  dataSources: 8,
  apiEndpoints: 24,
  mlModels: 6,
  totalDataProcessed: '2.4 PB',
  systemUptime: 99.8,
  errorRate: 0.2,
  responseTime: 245
};