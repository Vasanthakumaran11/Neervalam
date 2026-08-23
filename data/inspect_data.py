import pandas as pd
import json
import os

excel_file = "Tamil_Nadu_Groundwater_Level_Dataset_2024_25.xlsx"
xls = pd.ExcelFile(excel_file)
print("Sheet names:", xls.sheet_names)

for sheet in xls.sheet_names:
    df = pd.read_excel(xls, sheet_name=sheet)
    print(f"\n--- Sheet: {sheet} ---")
    print("Columns:", df.columns.tolist())
    print("Shape:", df.shape)
    print("First 3 rows:")
    print(df.head(3))
