<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>
					<v-textarea
						outlined
						name="input-7-4"
						label="快递单号"
						v-model="trackingArea"
					></v-textarea>
        </material-card>
			</v-col>
      <v-row>
        <v-col cols="4">
          <v-card
            class="ml-3"         
            tile
          >
          1
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-card
            class="mr-3"
            tile
          >
            <v-data-table
              :headers="headers"
              :items="batchPackageList"
              class="elevation-1"
            >
              <template v-slot:item.action="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="openProcessDialog(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="deleteFromBatch(item)"
                >
                  mdi-close
                </v-icon>
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getColor(item.status)"
                  dark
                >
                  {{ item.status }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
		</v-row>
	</v-container>
</template>
