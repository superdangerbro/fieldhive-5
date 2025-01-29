'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { BarChart, PieChart, Timeline, Build } from '@mui/icons-material';

// Lazy load the SchemaBuilder component
const SchemaBuilder = dynamic(() => import('@/components/SchemaBuilder'), {
  ssr: false,
});

// Dashboard stat card component
function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '30%',
          height: '100%',
          background: `linear-gradient(to right, transparent, ${color}08)`,
          opacity: 0.5,
        }
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: `${color}15`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography color="text.secondary" variant="body2" fontWeight={500}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Equipment"
            value="156"
            icon={<Build />}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Inspections"
            value="23"
            icon={<Timeline />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Month"
            value="89"
            icon={<BarChart />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completion Rate"
            value="94%"
            icon={<PieChart />}
            color="#6366f1"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Equipment Type Builder
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Create and manage your equipment types and inspection forms.
        </Typography>
        <SchemaBuilder />
      </Paper>
    </Box>
  );
}
