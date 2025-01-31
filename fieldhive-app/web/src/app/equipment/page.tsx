'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EquipmentCategories from '@/components/equipment/EquipmentCategories';
import AddCategoryDialog from '@/components/equipment/AddCategoryDialog';
import RequireAuth from '@/components/auth/RequireAuth';
import { useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRoles } from '@/services/base.service';

export default function EquipmentPage() {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const { can } = usePermissions();
  const isAdmin = can([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);

  return (
    <RequireAuth>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Equipment Management
          </Typography>

          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddCategory(true)}
            >
              Add Category
            </Button>
          )}
        </Box>

        <EquipmentCategories />

        <AddCategoryDialog
          open={openAddCategory}
          onClose={() => setOpenAddCategory(false)}
        />
      </Container>
    </RequireAuth>
  );
}
