use std::fs;
use std::path::{Path, PathBuf};
use std::io::{self, Write};
use reqwest::blocking::Client;
use indicatif::{ProgressBar, ProgressStyle};

pub struct ModelManager {
    cache_dir: PathBuf,
    base_url: String,
    model_filename: String,
}

impl ModelManager {
    pub fn new() -> Self {
        let home = dirs::home_dir().expect("Failed to get home directory");
        let cache_dir = home.join(".monocr").join("models");
        
        Self {
            cache_dir,
            base_url: "https://huggingface.co/janakhpon/monocr/resolve/main".to_string(),
            model_filename: "monocr.onnx".to_string(),
        }
    }

    pub fn get_model_path(&self) -> io::Result<PathBuf> {
        let model_path = self.cache_dir.join(&self.model_filename);
        
        if !model_path.exists() {
            println!("Model not found at {:?}. Downloading...", model_path);
            self.download_model(&model_path)?;
        }
        
        Ok(model_path)
    }

    fn download_model(&self, dest: &Path) -> io::Result<()> {
        if let Some(parent) = dest.parent() {
            fs::create_dir_all(parent)?;
        }

        let url = format!("{}/onnx/{}", self.base_url, self.model_filename);
        let client = Client::new();
        let mut response = client.get(url)
            .send()
            .map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;

        if !response.status().is_success() {
            return Err(io::Error::new(io::ErrorKind::Other, format!("Failed to download model: {}", response.status())));
        }

        let total_size = response.content_length().unwrap_or(0);
        let pb = ProgressBar::new(total_size);
        pb.set_style(ProgressStyle::default_bar()
            .template("{spinner:.green} [{elapsed_precise}] [{wide_bar:.cyan/blue}] {bytes}/{total_bytes} ({eta})")
            .unwrap()
            .progress_chars("#>-"));

        let mut file = fs::File::create(dest)?;
        let mut buffer = [0; 8192];
        let mut downloaded: u64 = 0;

        loop {
            let n = response.read(&mut buffer).map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;
            if n == 0 { break; }
            file.write_all(&buffer[..n])?;
            downloaded += n as u64;
            pb.set_position(downloaded);
        }

        pb.finish_with_message("Download complete");
        Ok(())
    }
}
