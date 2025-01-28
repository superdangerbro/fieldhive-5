import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton, 
  Button, 
  Menu, 
  MenuItem, 
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  TextFields as TextIcon,
  Numbers as NumberIcon,
  CheckBox as BooleanIcon,
  Today as DateIcon,
  Schedule as TimestampIcon,
  Link as ReferenceIcon,
  List as ArrayIcon,
  Code as ObjectIcon,
  LocationOn as GeolocationIcon,
  AttachFile as FileIcon,
  Image as ImageIcon,
  List as EnumIcon
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Map field types to icons
const typeIcons = {
  string: TextIcon,
  number: NumberIcon,
  boolean: BooleanIcon,
  date: DateIcon,
  timestamp: TimestampIcon,
  reference: ReferenceIcon,
  array: ArrayIcon,
  object: ObjectIcon,
  geolocation: GeolocationIcon,
  file: FileIcon,
  image: ImageIcon,
  enum: EnumIcon
};

// Sortable field item component
const SortableField = ({ field, selected, onSelect, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: selected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
    cursor: 'pointer'
  };

  const TypeIcon = typeIcons[field.type] || TextIcon;

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      secondaryAction={
        <IconButton edge="end" onClick={onRemove} size="small">
          <DeleteIcon />
        </IconButton>
      }
      onClick={onSelect}
    >
      <ListItemIcon {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
        <DragIcon />
      </ListItemIcon>
      <ListItemIcon>
        <TypeIcon />
      </ListItemIcon>
      <ListItemText 
        primary={field.name || '(Unnamed Field)'} 
        secondary={field.type}
        primaryTypographyProps={{
          variant: 'body2',
          color: field.name ? 'textPrimary' : 'textSecondary'
        }}
        secondaryTypographyProps={{
          variant: 'caption'
        }}
      />
    </ListItem>
  );
};

// Add field menu component
const AddFieldMenu = ({ anchorEl, open, onClose, onAddField, availableTypes }) => (
  <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
  >
    {availableTypes.map(type => {
      const TypeIcon = typeIcons[type] || TextIcon;
      return (
        <MenuItem 
          key={type} 
          onClick={() => {
            onAddField(type);
            onClose();
          }}
        >
          <ListItemIcon>
            <TypeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={type} />
        </MenuItem>
      );
    })}
  </Menu>
);

// Main FieldList component
const FieldList = ({
  fields,
  selectedIndex,
  onFieldSelect,
  onAddField,
  onRemoveField,
  availableTypes
}) => {
  const [addMenuAnchor, setAddMenuAnchor] = React.useState(null);

  const handleAddClick = (event) => {
    setAddMenuAnchor(event.currentTarget);
  };

  const handleAddClose = () => {
    setAddMenuAnchor(null);
  };

  return (
    <Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {fields.map((field, index) => (
          <SortableField
            key={field.id}
            field={field}
            selected={index === selectedIndex}
            onSelect={() => onFieldSelect(index)}
            onRemove={() => onRemoveField(index)}
          />
        ))}
      </List>
      
      {fields.length === 0 && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="textSecondary" variant="body2">
            No fields added yet
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Tooltip title="Add new field">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            size="small"
          >
            Add Field
          </Button>
        </Tooltip>
      </Box>

      <AddFieldMenu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={handleAddClose}
        onAddField={onAddField}
        availableTypes={availableTypes}
      />
    </Box>
  );
};

export default FieldList;
