'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  alpha,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddEquipmentTypeDialog from './AddEquipmentTypeDialog';
import { equipmentService, EquipmentCategory } from '@/services/equipment';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRoles } from '@/services/base.service';

export default function EquipmentCategories() {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | null>(null);
  const [openAddType, setOpenAddType] = useState(false);
  const { can } = usePermissions();
  const isAdmin = can([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: EquipmentCategory) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      await equipmentService.deleteCategory(selectedCategory.id);
      await loadCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError(err as Error);
    }
    handleMenuClose();
  };

  const handleAddEquipmentType = async (name: string) => {
    if (!selectedCategory) return;
    
    try {
      await equipmentService.addEquipmentType(selectedCategory.id, { name });
      await loadCategories();
    } catch (err) {
      console.error('Failed to add equipment type:', err);
      setError(err as Error);
    }
    setOpenAddType(false);
  };

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message}
      </Alert>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <Accordion key={category.id} sx={{ mb: 2 }}>
          <Box
            component={AccordionSummary}
            expandIcon={<ExpandMoreIcon />}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography>{category.name}</Typography>
            {isAdmin && (
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, category);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          <AccordionDetails>
            <Stack spacing={2}>
              {category.equipmentTypes?.map((type) => (
                <Box
                  key={type.id}
                  sx={{
                    p: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                    borderRadius: 1,
                  }}
                >
                  <Typography>{type.name}</Typography>
                </Box>
              ))}
              {isAdmin && (
                <Box>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedCategory(category);
                      setOpenAddType(true);
                    }}
                    size="small"
                  >
                    Add Equipment Type
                  </Button>
                </Box>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteCategory}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>

      <AddEquipmentTypeDialog
        open={openAddType}
        onClose={() => setOpenAddType(false)}
        onAdd={handleAddEquipmentType}
      />
    </>
  );
}
