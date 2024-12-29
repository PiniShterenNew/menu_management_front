import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Save, X, Edit, Trash, Settings2, Tags } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSettingsContext } from '../context/subcontexts/SettingsContext';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ColorPicker from './ColorPicker.jsx';
import { hexToRGB, isColorDark, getAlphaColor } from '../utils/ColorUtils';
// הגדרת סכמת הטופס
const schema = z.object({
  hourlyRate: z.number().positive("עלות שעת עבודה חייבת להיות מספר חיובי").min(0),
  fixedExpensesRate: z.number()
    .min(0, "האחוז חייב להיות בין 0 ל-100")
    .max(100, "האחוז חייב להיות בין 0 ל-100"),
  profitRate: z.number()
    .min(0, "האחוז חייב להיות בין 0 ל-100")
    .max(100, "האחוז חייב להיות בין 0 ל-100"),
  vatRate: z.number()
    .min(0, "מע\"מ חייב להיות מספר חיובי")
    .max(100, "מע\"מ חייב להיות מספר חיובי"),
});

function ConfirmDeleteDialog({ open, onConfirm, onCancel, itemName }) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>מחיקת קטגוריה</DialogTitle>
        </DialogHeader>
        <p>האם אתה בטוח שברצונך למחוק את הקטגוריה "{itemName}"?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            ביטול
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            מחיקה
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Settings({ flag, setFlag }) {
  const {
    settings,
    loading,
    updateSetting,
    fetchSettings,
    addCategoryContext,
    updateCategoryContext,
    deleteCategoryContext
  } = useSettingsContext();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      hourlyRate: settings?.hourlyRate?.value || 0,
      fixedExpensesRate: settings?.fixedExpensesRate?.value || 0,
      profitRate: settings?.profitRate?.value || 0,
      vatRate: parseFloat(settings?.vatRate?.value) || 0,
    },
  });

  // מצבים לטיפול בקטגוריות
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '' });
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedValues, setEditedValues] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [error, setError] = useState(null);

  // טעינת הגדרות בפתיחת החלון
  useEffect(() => {
    if (flag) {
      fetchSettings();
      setError(null);
    }
  }, [flag]);

  useEffect(() => {
    if (settings) {
      form.reset({
        hourlyRate: parseFloat(settings?.hourlyRate?.value) || 0,
        fixedExpensesRate: parseFloat(settings?.fixedExpensesRate?.value) || 0,
        profitRate: parseFloat(settings?.profitRate?.value) || 0,
        vatRate: parseFloat(settings?.vatRate?.value) || 0,
      });
    }
  }, [settings, form]);

  // התחלת עריכת קטגוריה
  const startEditing = (category) => {
    setEditingCategory(category);
    setEditedValues({
      name: category.name,
      description: category.description
    });
    setError(null);
  };

  // ביטול עריכה
  const cancelEditing = () => {
    setEditingCategory(null);
    setEditedValues(null);
    setError(null);
  };

  // עדכון ערכים בזמן עריכה
  const handleEditChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // שמירת קטגוריה מעודכנת
  const handleUpdateCategory = async () => {
    if (!editedValues?.name?.trim()) {
      setError("שם הקטגוריה הוא שדה חובה");
      return;
    }

    try {
      await updateCategoryContext(editingCategory._id, {
        ...editingCategory,
        ...editedValues
      });
      cancelEditing();
      await fetchSettings();
    } catch (error) {
      setError("שגיאה בעדכון הקטגוריה");
    }
  };

  // הוספת קטגוריה חדשה
  const handleAddCategory = async () => {
    if (!newCategory.name?.trim()) {
      setError("שם הקטגוריה הוא שדה חובה");
      return;
    }

    try {
      await addCategoryContext(newCategory);
      setNewCategory({ name: '', description: '', color: '' });
      setShowNewCategoryForm(false);
      setError(null);
      await fetchSettings();
    } catch (error) {
      setError("שגיאה בהוספת הקטגוריה");
    }
  };

  const isColorUsed = (color) => {
    return settings?.materialCategories?.value.some(category => category.color === color);
  };

  // מחיקת קטגוריה
  const handleDeleteCategory = async () => {
    try {
      await deleteCategoryContext(categoryToDelete._id);
      await fetchSettings();
      setDeleteDialogOpen(false);
    } catch (error) {
      setError("שגיאה במחיקת הקטגוריה");
    }
  };

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleSaveGeneralSettings = async (values) => {
    try {
      const settingsToUpdate = {
        hourlyRate: { value: parseFloat(values.hourlyRate) },
        fixedExpensesRate: { value: parseFloat(values.fixedExpensesRate) },
        profitRate: { value: parseFloat(values.profitRate) },
        vatRate: { value: parseFloat(values.vatRate) },
      };

      await updateSetting(settingsToUpdate);
    } catch (error) {
    }
  };

  return (
    <Dialog open={flag} onOpenChange={setFlag} className="rtl">
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">הגדרות מערכת</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="general" className="h-full rtl">
          <TabsList className="grid w-full grid-cols-2 rtl">
            <TabsTrigger value="general" className="flex items-center gap-2 rtl">
              <Settings2 className="w-4 h-4 rtl" />
              הגדרות כלליות
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tags className="w-4 h-4" />
              קטגוריות
            </TabsTrigger>
          </TabsList>
          <div className="px-1 rtl" style={{ height: 'calc(90vh - 140px)' }}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <TabsContent value="general" className="mt-4 rtl flex flex-col w-full">
              {/* הגדרות תמחור */}
              <CardHeader className="rtl">
                <CardTitle>הגדרות תמחור</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 rtl">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSaveGeneralSettings)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>עלות שעת עבודה (₪)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="הכנס עלות שעת עבודה"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fixedExpensesRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>אחוז השתתפות בהוצאות קבועות (%)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              placeholder="הכנס אחוז הוצאות"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profitRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>אחוז רווח רצוי (%)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              placeholder="הכנס אחוז רווח"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vatRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel> מע"מ (%)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0.10"
                              max="100"
                              placeholder={"מע\"מ"}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-center text-center">
                      <Button
                        type="submit"
                        className="flex items-center gap-2"
                        disabled={loading}
                      >
                        <Save className="w-4 h-4" />
                        שמור הגדרות
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
            <TabsContent value="categories" className="mt-4 rtl flex flex-col w-full">
              {/* ניהול קטגוריות */}
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>קטגוריות חומרי גלם</CardTitle>
                {!showNewCategoryForm && (
                  <Button
                    variant="outline"
                    onClick={() => setShowNewCategoryForm(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    הוסף קטגוריה
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* טופס קטגוריה חדשה */}
                {showNewCategoryForm && (
                  <Card className="border-2 border-zinc-200">
                    <CardContent className="space-y-4 p-4">
                      <div>
                        <Label>שם הקטגוריה</Label>
                        <Input
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>תיאור</Label>
                        <Input
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <ColorPicker
                        value={newCategory.color}
                        onChange={(color) => {
                          if (!isColorUsed(color)) {
                            setNewCategory({ ...newCategory, color: color });
                          } else {
                            setError("צבע זה כבר בשימוש");
                          }
                        }}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={handleAddCategory}
                          className="flex items-center gap-2"
                          disabled={loading}
                        >
                          <Save className="w-4 h-4" />
                          שמור
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowNewCategoryForm(false);
                            setNewCategory({ name: '', description: '', color: '' });
                          }}
                          className="flex items-center gap-2"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                          ביטול
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* רשימת קטגוריות */}
                <div className="space-y-2 max-h-[59vh] overflow-y-auto pr-2">
                  {settings?.materialCategories?.value.map((category) => (
                    <Card key={category._id} className="border border-zinc-200"

                    >
                      <CardContent className="p-4">
                        {editingCategory?._id === category._id ? (
                          <div className="space-y-4">
                            <div>
                              <Label>שם</Label>
                              <Input
                                value={editedValues?.name}
                                onChange={(e) => handleEditChange('name', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>תיאור</Label>
                              <Input
                                value={editedValues?.description}
                                onChange={(e) => handleEditChange('description', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <ColorPicker
                              value={editedValues?.color || category?.color}
                              onChange={(color) => {
                                if (!isColorUsed(color)) {
                                  handleEditChange('color', color);
                                } else {
                                  setError("צבע זה כבר בשימוש");
                                }
                              }}
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={handleUpdateCategory}
                                disabled={loading}
                                className="flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                שמור
                              </Button>
                              <Button
                                variant="outline"
                                onClick={cancelEditing}
                                disabled={loading}
                                className="flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                ביטול
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center"
                          >
                            <div
                            >
                              <div
                                className="font-medium flex flex-row items-center gap-2"
                                style={{
                                  // color: category?.color ? (isColorDark(category.color) ? 'white' : category.color) : 'inherit'
                                }}
                              >
                                {category.name}
                                <div className="w-4 h-4 rounded-full shadow-sm border border-zinc-200"
                                  style={{
                                    backgroundColor: category?.color,
                                  }}
                                />
                              </div>
                              <div className="text-sm text-zinc-500"
                                style={{
                                  // color: category?.color ? (isColorDark(category.color) ? 'white' : category.color) : 'inherit'
                                }}
                              >
                                {category.description}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(category)}
                                className="flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                ערוך
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(category._id)}
                                className="flex items-center gap-2"
                              >
                                <Trash className="w-4 h-4" />
                                מחק
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
      {/* דיאלוג מחיקה */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteDialogOpen(false)}
        itemName={categoryToDelete?.name}
      />
    </Dialog>
  );
}