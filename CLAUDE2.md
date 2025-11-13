## CLAUDE2.md

This file explains the use of files and folders in this project.

**LIBRARIES/PACKAGES USED IN THIS PROJECT**
This Project uses React 19 + vite with many libraries like (read package.json for detailed understanding) : 

1. For styling 
- tailwind for styling 
- tailwind-merge (exported and used as cn , configured in src/utils/helper.ts, consists clsx as well)

2. For API calls to backend 
- axios (instance created in apiService file)
- tanstack-query (used in all features seperately in query-hooks folder )

3. For logging 
- sentry

4. For store 
- zustand

5. For routing 
- tanstack-router

6. For icons
- Lucide react 

7. For forms 
- react-hook-form

8. For validations and schema 
- zod

9. For Toasts
- sonner

## Folder Structure and Base Files

.
├── CLAUDE.md
├── CLAUDE2.md
├── README.md
├── eslint.config.js
├── index.html
├── logger
│   └── logger.ts
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── AppInitializer.tsx
│   ├── api
│   │   ├── apiPaths.ts
│   │   └── apiService.ts
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── base
│   │   │   ├── Button.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Divider.tsx
│   │   │   ├── ErrorText.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Switch.tsx
│   │   │   └── Textarea.tsx
│   │   ├── charts
│   │   │   └── ProgressBar.tsx
│   │   ├── common-form-fields/
│   │   ├── compound
│   │   │   ├── AccessControlledMenu.tsx
│   │   │   ├── ActiveChip.tsx
│   │   │   ├── ActiveIndicator.tsx
│   │   │   ├── AppliedFilters.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Bento.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── Collapsible.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── CurrencyDisplay.tsx
│   │   │   ├── CustomToast.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── DatePickerInput.tsx
│   │   │   ├── DeleteDialog.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── ImageComponent.tsx
│   │   │   ├── ImageStack.tsx
│   │   │   ├── ImageZoomDialog.tsx
│   │   │   ├── InfoItem.tsx
│   │   │   ├── LightboxGallery.tsx
│   │   │   ├── ListItem.tsx
│   │   │   ├── MenuItem.tsx
│   │   │   ├── MultiSelectWithChips.tsx
│   │   │   ├── NavBlocker.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Popover.tsx
│   │   │   ├── QuantityControl.tsx
│   │   │   ├── QueryStateHandler.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── Sheet.tsx
│   │   │   ├── Sonner.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── TimePicker.tsx
│   │   │   ├── ToggleButtonGroup.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── VegIndicator.tsx
│   │   │   ├── VegTypeSelector.tsx
│   │   │   ├── cards/
│   │   │   ├── media-picker/
│   │   │   ├── spinner
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── spinner.module.css
│   │   │   ├── table
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── TableCell.tsx
│   │   │   │   └── table.types.ts
│   │   │   └── time-range
│   │   │       ├── TimeRangeButton.tsx
│   │   │       ├── TimeRangeSelector.tsx
│   │   │       └── timeRange.types.ts
│   │   ├── empty-states
│   │   │   ├── AppLoader.tsx
│   │   │   ├── AppShimmer.tsx
│   │   │   ├── BentoSkeleton.tsx
│   │   │   ├── FallbackView.tsx
│   │   │   ├── GlobalNotFound.tsx
│   │   │   ├── NoSearchResult.tsx
│   │   │   ├── NoShifts.tsx
│   │   │   ├── NoTimeRangeSelected.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── Unauthorized.tsx
│   │   │   ├── UploadImagePlaceholder.tsx
│   │   │   └── index.css
│   │   ├── shared
│   │   │   ├── Header.tsx
│   │   │   ├── LogoutDialog.tsx
│   │   │   ├── NotificationPopover.tsx
│   │   │   ├── ProfilePopover.tsx
│   │   │   ├── SidebarDrawer.tsx
│   │   │   ├── sidebar
│   │   │   │   ├── NavItem.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── utils
│   │   │       └── sidebarUtil.ts
│   │   └── toast
│   │       ├── CustomToast.tsx
│   │       └── Sonner.tsx
│   ├── constants
│   │   └── routes.ts
│   ├── hooks
│   │   ├── useDebounce.ts
│   │   └── useToggle.tsx
│   ├── index.css
│   ├── lib
│   │   ├── queryClient.ts
│   │   └── sentry.ts
│   ├── main.tsx
│   ├── store
│   │   ├── useAuthStore.ts
│   │   └── useThemeStore.ts
│   ├── types
│   │   ├── baseApi.types.ts
│   │   └── user.types.ts
│   └── utils
│       ├── formatDateTime.ts
│       ├── getDetailedTimeElapsed.ts
│       ├── helpers.ts
│       ├── localStorageUtil.ts
│       └── tokenUtil.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts

## Important files 
**tailwind.config.js**
it consist of several classes , important ones are 
a-primary, a-secondary and so on. which is basically the color palette for this project.

## Notes
@ in the imports is an alias for src 


## Folder-Wise Explanation

## 1. logger folder
  - logger.ts 
  a file that has 3 functions inside it for error, warning and info printing. 

  *important* 
    use these 3 functions only for logging instead of manually doing console.log()

## 2. src folder
    1.api
        - apiPaths.ts : consist of the api endpoints for backend, could be an object or string exported as const
        - apiService.ts : has an axiosInstance and takes props {
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        endpoint: string;
        headers?: Record<string, string>;
        data?: any;
        params?: Record<string , string|number|boolean>;
        config?: AxiosRequestConfig;
        }
        - endpoint passes is always from apiPaths
        - pass params when method is GET else pass data

    2.components
        - has many sub folders, try to look for the needed file in one of these folders
        - base folder has basic files 
        - common-form-fields has Radio
        - compound folder has spinner, table, time-range folder and many important files needed for small tasks. When creating a component must check out the names of these files and folders and then predict the File needed, if some file looks like it has some content then check its code and see if its suitable for the type of work we need ? if yes then use it else see if minor modifications can make that file usable if yes then do it else create a new file. try to reuse the file as much as you can. but also check that the modifications doesnt destroy the working of some other existing file . so you can check the usage of that file by searching for its import in other folders, if found then check if modifications are suitable or not, if all good then go ahead else create a new file. 
        - empty states has some files for empty state or maybe shimmer/skelton Ui, use them if possible 
        - shared foler has all the shared components , use them when needed like LogoutDialog and Popover etc.
        - toast , uses sonner library, must use this Sonner.tsx file and showToast everywhere toast is needed.

    3.constants
        - routes.ts : all the frontend routes for webpages

    4.hooks
        - consist of hooks which are common for the files like useDebounce.ts and useToggle.ts , use them when needed.

    5.lib
        - has all the library setup with files like queryClient.ts which creates the queryClient object used by tanstackQuery.
        - sentry.ts is setup for logging.
    
    6.store
        - zustand store 
        - has hooks for state management like useAuthStore.ts and useThemeStore.ts

    7.types
        - consist of the types used in more than 1 file or module

    8.utils
        - utility folder consisting of the files used by multiple other files
        - use formatDateTime.ts file for formatting date
        - use getDetailedTimeElapsedSince.ts to get the time elapsed since 
        - helpers.ts has important functions like cn, toCommaSeperated, getFileExtension, sendBack, getResponsiveGridLayoutClass, formatCurrencyINR, formatPhoneNumber, prettyNumber etc.
        - localStorageUtil to handle the localstorage related tasks
        - tokenUtil for storing or retrieving token from localstorage


    9.features (Most Important)
        - this folder will consist of all the important features for this project
        - this will be its folder structure : 
            <feature_name> (eg: products)
                - index.tsx (main file, all components are assembled here)

     





