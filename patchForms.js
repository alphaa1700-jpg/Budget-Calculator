const fs = require('fs');
const path = require('path');

const formsDir = 'src/components/forms';
const files = fs.readdirSync(formsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const fullPath = path.join(formsDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Add updateRecord to imports
  if (!content.includes('updateRecord')) {
    content = content.replace('createRecord', 'createRecord, updateRecord');
  }

  // Update component signature to accept initialData
  const functionMatch = content.match(/export function ([A-Za-z]+)\(\{ onSuccess \}: \{ onSuccess\?: \(\) => void \}\) \{/);
  if (functionMatch) {
    const componentName = functionMatch[1];
    
    // Replace signature
    content = content.replace(
      functionMatch[0],
      `export function ${componentName}({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {`
    );

    // Update useForm to use defaultValues
    content = content.replace(
      'const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });',
      'const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: initialData || {} });'
    );

    // Update onSubmit to handle both create and update
    // We need to find the sheet name. Let's extract it from createRecord call.
    const sheetMatch = content.match(/createRecord\("([^"]+)", values\)/);
    if (sheetMatch) {
      const sheetName = sheetMatch[1];
      const newSubmit = `
    setIsSubmitting(true);
    try {
      let result;
      if (initialData?.id) {
        result = await updateRecord("${sheetName}", initialData.id, values);
      } else {
        result = await createRecord("${sheetName}", values);
      }
      if (result.success) {
        toast.success(initialData?.id ? "Updated successfully!" : "Saved successfully!");
        if (!initialData?.id) form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast.error("Error: " + result.error);
      }
    } catch (e) {
      toast.error("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  }`;
      
      // Replace the old try...finally block
      content = content.replace(/setIsSubmitting\(true\);\s+try \{[\s\S]*?\} finally \{\s+setIsSubmitting\(false\);\s+\}/, newSubmit.trim());
    }
    
    // Update button text to Save / Update
    content = content.replace(
      /\{isSubmitting \? <Loader2 className="mr-2 h-4 w-4 animate-spin" \/> : "Save"\}/,
      '{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData?.id ? "Update" : "Save")}'
    );

    fs.writeFileSync(fullPath, content);
    console.log('Patched form ' + file);
  }
});
