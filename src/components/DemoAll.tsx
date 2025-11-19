import React, { useState } from "react";
import { useForm } from "react-hook-form";

// --- Base Components ---
// import { Button } from "@/components/base/Button";
import Chip from "@/components/base/Chip";
import { DateTimeInput } from "@/components/base/DateTimeInput";
import Divider from "@/components/base/Divider";
// import Dropdown, { DropdownOption } from "@/components/base/DropDown";
// import DropDown from "demaze-ui-lib/components/DropDown";
import ErrorText from "@/components/base/ErrorText";
// import FileUploadField from "demaze-ui-lib/components";

// import { Checkbox } from "demaze-ui-lib/components";

import Icon from "@/components/base/Icon";
import { Image } from "@/components/base/Image";
import { Input } from "@/components/base/Input";
import Label from "@/components/base/Label";
import { MobileNumberInput } from "@/components/base/MobileNumberInput";
import { OTPInput } from "@/components/base/OTPInput";
import { RadioGroup as BaseRadioGroup } from "@/components/base/RadioGroup";
import Select from "@/components/base/Select";
import Separator from "@/components/base/Separator";
import Switch from "@/components/base/Switch";
import Textarea from "@/components/base/Textarea";

// --- Charts ---
import ProgressBar from "@/components/charts/ProgressBar";

// --- Common Form Fields ---
import { AmountTypeInput } from "@/components/common-form-fields/AmountWithTypeInput";
import BooleanInput from "@/components/common-form-fields/BooleanInput";
// import Radio from "@/components/common-form-fields/Radio";

// --- Compound Components ---
import ActiveChip from "@/components/compound/ActiveChip";
import ActiveIndicator from "@/components/compound/ActiveIndicator";
import Avatar from "@/components/compound/Avatar";
import Bento from "@/components/compound/Bento";
import Breadcrumbs from "@/components/compound/Breadcrumbs";
import Collapsible from "@/components/compound/Collapsible";
import CustomColorPicker from "@/components/compound/ColorPickerDialog";
import Container from "@/components/compound/Container";
import CurrencyDisplay from "@/components/compound/CurrencyDisplay";
import { DatePicker } from "@/components/compound/DatePicker";
import DatePickerInput from "@/components/compound/DatePickerInput";
import DeleteDialog from "@/components/compound/DeleteDialog";
import Dialog from "@/components/compound/Dialog";
import ImageComponent from "@/components/compound/ImageComponent";
import ImageStack from "@/components/compound/ImageStack";
import LightboxGallery from "@/components/compound/LightboxGallery";
import MagnifyingImage from "@/components/compound/MagnifyingImage";
import MediaDialog from "@/components/compound/MediaDialog";
import { MultiSelectWithChips } from "@/components/compound/MultiSelectWithChips";
import NavBlocker from "@/components/compound/NavBlocker";
import Pagination from "@/components/compound/Pagination";
import { Popover } from "@/components/compound/Popover";
import QuantityControl from "@/components/compound/QuantityControl";
import { RadioGroup as CompoundRadioGroup } from "@/components/compound/RadioGroup";
import Search from "@/components/compound/Search";
import SearchInput from "@/components/compound/SearchInput";
import Sheet from "@/components/compound/Sheet";
import { toast } from "@/components/compound/Sonner";
import Tabs, { TabItem } from "@/components/compound/Tabs";
import TimePickerInput from "@/components/compound/TimePicker";
import ToggleButtonGroup from "@/components/compound/ToggleButtonGroup";
import Tooltip from "@/components/compound/Tooltip";
import SelectionCard from "@/components/compound/cards/SelectionCard";
import StatCard from "@/components/compound/cards/StatCard";
import VariantSelectorCard from "@/components/compound/cards/VariantSelectorCard";
// import Spinner from "@/components/compound/spinner/Spinner";
import { Table } from "@/components/compound/table/Table";
import { TimeRangeSelector } from "@/components/compound/time-range/TimeRangeSelector";
import PillPath from "@/components/compound/PillPath";
import ImageZoomDialog from "@/components/compound/ImageZoomDialog";

// --- Empty States ---
import AppLoader from "@/components/empty-states/AppLoader";
import AppShimmer from "@/components/empty-states/AppShimmer";
import BentoSkeleton from "@/components/empty-states/BentoSkeleton";
import FallbackView from "@/components/empty-states/FallbackView";
import GlobalNotFound from "@/components/empty-states/GlobalNotFound";
import NoSearchResult from "@/components/empty-states/NoSearchResult";
import NotFound from "@/components/empty-states/NotFound";
import Unauthorized from "@/components/empty-states/Unauthorized";
import UploadImagePlaceholder from "@/components/empty-states/UploadImagePlaceholder";

// --- Shared ---
import Logo from "@/components/shared/Logo";
import LogoutDialog from "@/components/shared/LogoutDialog";
import { Button, Checkbox, Dropdown, DropdownOption, Spinner } from "demaze-ui-lib/components";
// import { Button, } from "demaze-ui-lib/components";


// --- Helper Component ---
const Section = ({ title, path, children }: { title: string; path: string; children: React.ReactNode }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 shadow-sm mb-8">
    <div className="mb-6 border-b border-gray-100 dark:border-neutral-800 pb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <code className="text-xs text-gray-500 font-mono mt-1 block">{path}</code>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
    <div className="flex flex-wrap gap-4 items-center">{children}</div>
  </div>
);

// --- Main Demo Component ---
export default function DemoAll() {
  // State for interactive components
  const [switchVal, setSwitchVal] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("tab1");
  const [selectedTab2, setSelectedTab2] = useState("1");
  const [date, setDate] = useState<number | null>(Date.now());
  const [otp, setOtp] = useState("");
  const [dropdownVal, setDropdownVal] = useState<string>("");
  const [multiDropdownVal, setMultiDropdownVal] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [radioVal, setRadioVal] = useState("opt1");
  const [appLoaderShow, setAppLoaderShow] = useState(false);
  
  // React Hook Form for Form Fields
  const { control } = useForm({
    defaultValues: {
      amount: 100,
      type: "fix",
    }
  });

  // Dummy Data
  const dummyOptions = [
    { label: "Option One", value: "opt1" },
    { label: "Option Two", value: "opt2" },
    { label: "Option Three (Disabled)", value: "opt3", disabled: true },
  ];

  const tableData = [
    { id: 1, name: "Project Alpha", status: "Active", budget: 5000 },
    { id: 2, name: "Project Beta", status: "Pending", budget: 12000 },
    { id: 3, name: "Project Gamma", status: "Completed", budget: 8500 },
  ];

  const tableColumns = [
    { header: "ID", accessor: "id" as const },
    { header: "Name", accessor: "name" as const },
    { 
        header: "Status", 
        accessor: "status" as const,
        cell: (val: string) => <Chip label={val} color={val === "Active" ? "green" : "yellow"} />
    },
    { header: "Budget", accessor: "budget" as const, cell: (val: number) => `$${val}` },
  ];

  const demoImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-primary-600">Component Library Demo</h1>
        <p className="text-gray-600 mb-10">Comprehensive showcase of all UI components in the system.</p>

        {/* 1. BASE COMPONENTS */}
        <Section title="Buttons" path="src/components/base/Button.tsx">
        <Spinner/>
           <SubSection title="Variants">
             <Button variant="filled">Filled</Button>
             <Button variant="outline">Outline</Button>
             <Button variant="ghost">Ghost</Button>
             <Button variant="link">Link</Button>
             <Button variant="text">Text</Button>
           </SubSection>
           <SubSection title="Colors">
             <Button color="primary">Primary</Button>
             <Button color="neutral">Neutral</Button>
             <Button color="success">Success</Button>
             <Button color="danger">Danger</Button>
           </SubSection>
           <SubSection title="States & Sizes">
             <Button isLoading>Loading</Button>
             <Button disabled>Disabled</Button>
             <Button size="sm">Small</Button>
             <Button size="lg">Large</Button>
             <Button startIcon="Save">With Icon</Button>
           </SubSection>
        </Section>

        <Section title="Inputs" path="src/components/base/Input.tsx">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Input label="Standard Input" placeholder="Type here..." />
             <Input label="With Error" error="This field is required" />
             <Input label="With Success" success defaultValue="Valid Input" />
             <Input label="Password" type="password" togglePassword placeholder="********" />
             <Input label="Disabled" disabled defaultValue="Cannot edit this" />
             <Input label="Verified" isVerified showStatus verifiedText="Email Verified" defaultValue="user@example.com" />
             <Input label="With Icon" leftElement={<Icon name="Search" size={16}/>} placeholder="Search..." />
           </div>
        </Section>

        <Section title="Selection Controls" path="src/components/base/Switch.tsx | Checkbox.tsx | RadioGroup.tsx">
           <SubSection title="Switch">
             <Switch checked={switchVal} onCheckedChange={setSwitchVal} label="Toggle Me" />
             <Switch checked={true} disabled label="Disabled On" />
             <Switch checked={false} size="lg" error="Error state" onCheckedChange={()=>{}} label="Error" />
           </SubSection>
           <SubSection title="Checkbox">
             <Checkbox checked={checkboxVal} onChange={setCheckboxVal} label="Accept Terms" />
             <Checkbox checked={true} disabled label="Disabled Checked" />
             <Checkbox indeterminate label="Indeterminate" />
           </SubSection>
           <SubSection title="Base Radio Group">
             <BaseRadioGroup 
                size="md" 
                options={[
                    { label: "Option A", value: "A" },
                    { label: "Option B", value: "B" }
                ]}
                name="demo-radio"
                defaultValue="A"
             />
           </SubSection>
        </Section>

        <Section title="Dropdowns & Selects" path="src/components/base/DropDown.tsx | Select.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="mb-2 font-semibold">Custom Dropdown</h4>
                    <Dropdown
                        label="Single Select" 
                        options={dummyOptions as DropdownOption[]}
                        value={dropdownVal}
                        onChange={setDropdownVal}
                        placeholder="Choose an option"
                    />
                    <div className="mt-4"></div>
                    <Dropdown 
                        label="Multi Select with Search" 
                        options={dummyOptions as DropdownOption[]}
                        value={multiDropdownVal}
                        onChange={setMultiDropdownVal}
                        multiple
                        searchable
                        placeholder="Choose options"
                    />
                </div>
                <div>
                    <h4 className="mb-2 font-semibold">React Select Wrapper</h4>
                    <Select 
                        label="React Select Single"
                        options={dummyOptions}
                        placeholder="Select..."
                    />
                    <div className="mt-4"></div>
                    <Select 
                        label="React Select Multi"
                        options={dummyOptions}
                        isMulti
                        placeholder="Select multiple..."
                    />
                </div>
            </div>
        </Section>

        <Section title="Special Inputs" path="src/components/base/...">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MobileNumberInput label="Mobile Number" countryCode="+91" />
                <OTPInput length={4} value={otp} onValueChange={setOtp} label="OTP Input" />
                <DateTimeInput label="Date Time Input" />
                {/* <FileUploadField 
                    label="File Upload" 
                    multiple 
                    value={files}
                    onChange={setFiles}
                    helperText="Upload images or docs"
                /> */}
                <Textarea label="Textarea" placeholder="Long text here..." />
            </div>
        </Section>

        <Section title="Feedback & Display" path="src/components/base/...">
            <div className="flex flex-wrap gap-4 items-center">
                <Chip label="Primary Chip" color="blue" />
                <Chip label="Success Chip" color="green" />
                <Chip label="Error Chip" color="red" />
                <Chip label="Collapsible" color="purple" isCollapsible onCollapse={() => alert("Closed")} />
            </div>
            <div className="mt-6 space-y-2">
                <Label required>Form Label</Label>
                <ErrorText>This is an error text example</ErrorText>
                <Separator className="my-4" />
                <div className="h-10 w-full">
                    <Divider />
                </div>
            </div>
        </Section>

        {/* 2. COMPOUND COMPONENTS */}
        <Section title="Compound Components" path="src/components/compound/...">        
            <SubSection title="Tabs 2 (Modern)">
                 <Tabs
                    tabs={[
                        { id: "1", label: "Overview", value: "1" },
                        { id: "2", label: "Details", value: "2" },
                        { id: "3", label: "Settings", value: "3" }
                    ]}
                    selectedValue={selectedTab2}
                    onChange={setSelectedTab2}
                    size="md"
                 />
            </SubSection>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold mb-4">Data Display</h3>
                    <div className="space-y-4">
                        <Avatar fallback="JD" size="lg" />
                        <CurrencyDisplay amount={12345.67} strikeThroughPrice={15000} />
                        <ProgressBar progress={65} total={100} />
                        <ActiveIndicator readonly isActive={true} label="Status Indicator" />
                        <ActiveChip isActive={false} label="Active Chip" />
                    </div>
                </div>
                
                <div>
                    <h3 className="font-semibold mb-4">Interactive</h3>
                    <div className="space-y-4">
                         <Search value={searchValue} setValue={setSearchValue} placeholder="Search component..." />
                         <QuantityControl quantity={quantity} onIncrement={() => setQuantity(q => q+1)} onDecrement={() => setQuantity(q => Math.max(0, q-1))} showLabel />
                         <ToggleButtonGroup 
                            buttonList={[{ label: "Day", value: "day" }, { label: "Week", value: "week" }]}
                            selected={{ label: "Day", value: "day" }}
                            onChange={() => {}}
                         />
                         <Tooltip content="This is a tooltip">
                             <Button variant="outline" size="sm">Hover Me</Button>
                         </Tooltip>
                         <Popover trigger={<Button size="sm">Open Popover</Button>}>
                             <div className="p-2"><p>Popover Content</p></div>
                         </Popover>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-semibold mb-4">Dialogs & Overlays</h3>
                <div className="flex gap-4">
                    <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                    <Button onClick={() => setSheetOpen(true)}>Open Sheet</Button>
                    <Button color="danger" onClick={() => setDeleteDialogOpen(true)}>Delete Dialog</Button>
                </div>

                <Dialog 
                    isOpen={dialogOpen} 
                    close={() => setDialogOpen(false)} 
                    title="Example Dialog"
                    actions={{
                        primary: { label: "Confirm", onClick: () => setDialogOpen(false) },
                        secondary: { label: "Cancel", onClick: () => setDialogOpen(false) }
                    }}
                >
                    <p className="text-gray-600">This is a reusable dialog component.</p>
                </Dialog>

                <Sheet 
                    isOpen={sheetOpen} 
                    close={() => setSheetOpen(false)} 
                    title="Example Sheet"
                    footer={<Button fullWidth onClick={() => setSheetOpen(false)}>Close</Button>}
                >
                    <p>Sheet content goes here...</p>
                </Sheet>

                <DeleteDialog 
                    isOpen={deleteDialogOpen}
                    close={() => setDeleteDialogOpen(false)}
                    onDelete={() => { alert("Deleted!"); setDeleteDialogOpen(false); }}
                    isDeleting={false}
                    name="Item #123"
                />
            </div>
            
            <div className="mt-8">
                <h3 className="font-semibold mb-4">Table</h3>
                <Table 
                    data={tableData}
                    columns={tableColumns}
                    enableRowSelection
                    selectedIds={[]}
                    onRowSelection={() => {}}
                    pagination={{
                        currentPage: 1,
                        pageSize: 10,
                        totalRows: 3,
                        totalPages: 1,
                        hasPrevPage: false,
                        hasNextPage: false,
                        currentRows: 3
                    }}
                />
            </div>
        </Section>
        
        {/* 3. IMAGES & MEDIA */}
        <Section title="Images & Media" path="src/components/compound/...">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h4 className="mb-2 font-medium">Standard Image</h4>
                    <Image src={demoImages[0]} alt="Demo 1" aspectRatio="16/9" rounded="md" />
                </div>
                <div>
                    <h4 className="mb-2 font-medium">Image Component (Zoomable)</h4>
                    <ImageComponent src={demoImages[1]} alt="Demo 2" className="h-48 w-full rounded-md" />
                </div>
                <div>
                    <h4 className="mb-2 font-medium">Image Stack</h4>
                    <ImageStack images={demoImages} label="Gallery Stack" />
                </div>
                <div>
                     <h4 className="mb-2 font-medium">Magnifying Image</h4>
                     <MagnifyingImage src={demoImages[2]} alt="Mag" width={300} height={200} rounded="md" />
                </div>
            </div>
        </Section>

        {/* 4. CARDS & LAYOUT */}
        <Section title="Cards & Layout" path="src/components/compound/cards/...">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard title="Total Users" icon="User" subTitle="+12% from last month" />
                <SelectionCard isSelected={true} onClick={() => {}}>
                    <div className="p-4">Selected Card</div>
                </SelectionCard>
                <VariantSelectorCard isSelected={false} onClick={() => {}} showIndicator>
                    <p className="font-medium">Variant B</p>
                </VariantSelectorCard>
            </div>
            
            <h4 className="mb-2 font-medium">Bento Grid Layout</h4>
            <Bento ratio="70-30" className="h-40">
                <div className="bg-blue-100 rounded-xl flex items-center justify-center h-full">70%</div>
                <div className="bg-green-100 rounded-xl flex items-center justify-center h-full">30%</div>
            </Bento>
            
            <div className="mt-6">
                <Container title="Collapsible Container" isCollapsible defaultOpen className="border border-gray-200">
                    <p>This is content inside a container.</p>
                </Container>
            </div>
            
             <div className="mt-6">
                <Breadcrumbs breadcrumbs={[{ label: "Home", to: "/" }, { label: "Library", to: "/library" }, { label: "Data", to: "/data" }]} />
            </div>
            
             <div className="mt-6">
                <PillPath items={["Category", "Sub-Category", "Item"]} label="Breadcrumb Path" />
            </div>
        </Section>

        {/* 5. COMMON FORM FIELDS */}
        <Section title="Complex Form Fields" path="src/components/common-form-fields/...">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BooleanInput 
                    type="switch" 
                    label="Boolean Switch" 
                    checked={switchVal} 
                    onChange={setSwitchVal} 
                    helperText="Toggle to enable feature"
                />
                
                <AmountTypeInput 
                    control={control} 
                    name="amount" 
                    typeName="type" 
                    label="Amount with Type" 
                />
                
                {/* <Radio 
                    label="Standalone Radio" 
                    checked={radioVal === "opt1"} 
                    onChange={() => setRadioVal("opt1")}
                    description="This is a single radio description"
                /> */}
                
                <CompoundRadioGroup
                    size="md"
                    orientation="horizontal"
                    options={[
                        { label: "Horiz 1", value: "1" },
                        { label: "Horiz 2", value: "2" }
                    ]}
                    defaultValue="1"
                />
            </div>
             <div className="mt-4">
                <DatePickerInput label="Date Picker Input" value={date} onChange={setDate} />
                <div className="mt-4"></div>
                <TimeRangeSelector onChange={(r) => console.log(r)} />
            </div>
            <div className="mt-4">
                 <TimePickerInput label="Time Picker" />
            </div>
            <div className="mt-4 w-full max-w-md">
                <CustomColorPicker 
                    isOpen={false} // Set true to demo, handled via button usually
                    title="Color Picker (Hidden)"
                /> 
                <div className="p-4 border rounded-lg bg-white">
                   <p className="mb-2 text-sm text-gray-500">Color Picker Demo (Inline not supported, click to open)</p>
                   <Button size="sm" variant="outline">Open Color Picker</Button>
                </div>
            </div>
        </Section>

        {/* 6. EMPTY STATES & SKELETONS */}
        <Section title="Empty States & Loading" path="src/components/empty-states/...">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="border p-4 rounded-lg">
                    <UploadImagePlaceholder onClick={() => {}} placeholder="Click to upload" />
                 </div>
                 <div className="border p-4 rounded-lg">
                    <NoSearchResult message="Try adjusting filters" />
                 </div>
                 <div className="border p-4 rounded-lg">
                     <FallbackView title="Something went wrong" icon="AlertTriangle" />
                 </div>
                 <div className="border p-4 rounded-lg h-60 relative overflow-hidden">
                     <BentoSkeleton />
                 </div>
            </div>
            <div className="mt-4">
                <Button onClick={() => { setAppLoaderShow(true); setTimeout(() => setAppLoaderShow(false), 2000); }}>
                    Show App Loader (2s)
                </Button>
                {appLoaderShow && <AppLoader isLoading={true} />}
            </div>
            <div className="mt-4">
                 <h4 className="mb-2 font-medium">App Shimmer Preview</h4>
                 <div className="h-40 overflow-hidden border rounded relative">
                    <AppShimmer />
                 </div>
            </div>
        </Section>
        
        {/* 7. SHARED */}
        <Section title="Shared Components" path="src/components/shared/...">
            <div className="flex items-center gap-8">
                <Logo className="h-16 w-auto" />
                <Button variant="outline" onClick={() => toast.success("This is a success toast")}>
                    Trigger Toast
                </Button>
                <LogoutDialog isOpen={false} close={()=>{}} />
            </div>
        </Section>

        {/* Global Components that render via Portal */}
        <MediaDialog />
        <ImageZoomDialog />
        
      </div>
    </div>
  );
}
