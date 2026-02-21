import pandas as pd
import country_converter as coco

cc = coco.CountryConverter()
df = pd.read_csv('aiu_ineligible_persons.csv')

nationalities = df['Nationality'].tolist()
df['Country Name'] = cc.convert(nationalities, to='name_short', src='IOC')
df.to_csv('aiu_ineligible_persons.csv', index=False)
